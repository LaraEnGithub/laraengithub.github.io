import { useEffect, useState } from 'react'

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const Typewriter = ({ text, speed }: { text: string; speed: number }) => {
  const [count, setCount] = useState(() => (prefersReducedMotion() ? text.length : 0))

  useEffect(() => {
    if (count >= text.length) return
    const id = setTimeout(() => setCount((c) => c + 1), speed)
    return () => clearTimeout(id)
  }, [count, text.length, speed])

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.slice(0, count)}
        <span className="cursor">_</span>
        <span className="typewriter-rest">{text.slice(count)}</span>
      </span>
    </>
  )
}
