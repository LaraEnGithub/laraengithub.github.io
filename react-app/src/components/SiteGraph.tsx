import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router'
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from 'd3-force'
import { drag } from 'd3-drag'
import { select } from 'd3-selection'
import { zoom, zoomIdentity, type ZoomTransform } from 'd3-zoom'
import { useLang } from '../i18n/lang'
import type { TranslationKey } from '../i18n/translations'
import { SITE_MAP } from '../siteMap'

type GraphNode = SimulationNodeDatum & {
  id: string
  path: string
  label: TranslationKey
  r: number
}

type GraphLink = SimulationLinkDatum<GraphNode> & { source: GraphNode; target: GraphNode }

const EDGES = SITE_MAP.filter((s) => s.parent).map((s) => [s.parent!, s.id] as [string, string])

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const buildGraph = () => {
  const subtreeSize = (id: string): number =>
    1 + EDGES.filter(([parent]) => parent === id).reduce((sum, [, child]) => sum + subtreeSize(child), 0)
  const nodes: GraphNode[] = SITE_MAP.map((n) => ({ ...n, r: 12 + subtreeSize(n.id) * 3 }))
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const links: GraphLink[] = EDGES.map(([a, b]) => ({ source: byId.get(a)!, target: byId.get(b)! }))
  const neighbors = new Map(nodes.map((n) => [n.id, new Set([n.id])]))
  for (const [a, b] of EDGES) {
    neighbors.get(a)!.add(b)
    neighbors.get(b)!.add(a)
  }
  const simulation = forceSimulation(nodes).stop()
  return { nodes, links, neighbors, simulation }
}

export const SiteGraph = ({ style }: { style?: CSSProperties }) => {
  const { t } = useLang()
  const navigate = useNavigate()
  const svgRef = useRef<SVGSVGElement>(null)
  const [{ nodes, links, neighbors, simulation }] = useState(buildGraph)
  const [, setFrame] = useState(0)
  const [transform, setTransform] = useState<ZoomTransform>(zoomIdentity)
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    simulation
      .force('link', forceLink<GraphNode, GraphLink>(links).distance(90))
      .force('charge', forceManyBody().strength(-350))
      .force('collide', forceCollide<GraphNode>((d) => d.r + 10))
      .force('center', forceCenter(0, 0))
      .on('tick', () => setFrame((f) => f + 1))

    if (prefersReducedMotion()) {
      simulation.tick(300)
      setFrame((f) => f + 1)
    } else {
      simulation.alpha(1).restart()
    }

    const nodeSelection = select(svg)
      .selectAll<SVGGElement, GraphNode>('.graph-node')
      .data(nodes)
      .call(
        drag<SVGGElement, GraphNode>()
          .clickDistance(4)
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x
            d.fy = d.y
          })
          .on('drag', (event, d) => {
            d.fx = event.x
            d.fy = event.y
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0)
            d.fx = null
            d.fy = null
          }),
      )

    if (window.matchMedia('(pointer: fine)').matches) {
      select(svg)
        .call(
          zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.5, 2.5])
            .on('zoom', (event) => setTransform(event.transform)),
        )
        .on('dblclick.zoom', null)
    }

    return () => {
      simulation.on('tick', null).stop()
      nodeSelection.on('.drag', null)
      select(svg).on('.zoom', null)
    }
  }, [nodes, links, simulation])

  const isDim = (id: string) => active !== null && !neighbors.get(active)!.has(id)

  return (
    <nav className="site-graph" style={style} aria-label={t('graph.label')}>
      <svg ref={svgRef}>
        <g transform={transform.toString()}>
          <svg x="50%" y="50%" overflow="visible">
            {links.map((link) => (
              <line
                key={`${link.source.id}-${link.target.id}`}
                className={
                  active !== null && link.source.id !== active && link.target.id !== active
                    ? 'graph-link is-dim'
                    : 'graph-link'
                }
                x1={link.source.x}
                y1={link.source.y}
                x2={link.target.x}
                y2={link.target.y}
              />
            ))}
            {nodes.map((node) => (
              <g
                key={node.id}
                className={`graph-node${node.id === active ? ' is-active' : ''}${isDim(node.id) ? ' is-dim' : ''}`}
                transform={`translate(${node.x ?? 0},${node.y ?? 0})`}
                role="link"
                tabIndex={0}
                aria-label={t(node.label)}
                onClick={() => navigate(node.path)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') navigate(node.path)
                }}
                onPointerEnter={() => setActive(node.id)}
                onPointerLeave={() => setActive(null)}
                onFocus={() => setActive(node.id)}
                onBlur={() => setActive(null)}
              >
                <circle r={node.r} className={node.id === 'home' ? 'is-root' : undefined} />
                <text y={node.r + 22} className="graph-label">
                  {t(node.label)}
                </text>
              </g>
            ))}
          </svg>
        </g>
      </svg>
    </nav>
  )
}
