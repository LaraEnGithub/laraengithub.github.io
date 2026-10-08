export const es = {
  'nav.home': 'HOME',
  'nav.playground': 'Playground',
  'nav.gallery': 'Galería',
  'nav.music': 'Música',
  'lang.switch': 'Cambiar a inglés',
  'construction.message': 'EN CONSTRUCCIÓN',
  'home.title': '¡HOLA, MUNDO!...',
  'home.subtitle': '[... o lo que sea que se diga hoy en día]',
  'graph.label': 'Mapa del sitio',
  'graph.photos': 'Fotos',
  'graph.3d': '3D',
  'side.random': 'Llévame a algún lugar interesante',
  'side.songOfTheDay': 'Canción del día',
  'side.seeAll': 'VER TODAS',
  'music.songsOfTheDay': 'Canciones del día',
}

export const en: typeof es = {
  'nav.home': 'HOME',
  'nav.playground': 'Playground',
  'nav.gallery': 'Gallery',
  'nav.music': 'Music',
  'lang.switch': 'Switch to Spanish',
  'construction.message': 'UNDER CONSTRUCTION',
  'home.title': 'HELLO, WORLD!...',
  'home.subtitle': '[... or whatever the kids say nowadays]',
  'graph.label': 'Site map',
  'graph.photos': 'Photos',
  'graph.3d': '3D',
  'side.random': 'Take me somewhere interesting',
  'side.songOfTheDay': 'Song of the day',
  'side.seeAll': 'SEE ALL',
  'music.songsOfTheDay': 'Songs of the day',
}

export type TranslationKey = keyof typeof es
