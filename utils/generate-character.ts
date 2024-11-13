export const hashCode = (name: string) => {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    const character = name.charCodeAt(i)
    hash = (hash << 5) - hash + character
    hash = hash & hash
  }
  return Math.abs(hash)
}

const CHARACTERS = [
  'cute-butterfly-a',
  'cute-butterfly-b',
  'cute-phoenix-a',
  'cute-phoenix-b',
  'fire-gazer-a',
  'fire-gazer-b',
  'fire-gazer-c',
  'fire-pig-a',
  'fire-pig-a2',
  'fire-pig-b',
  'fire-pig-b2',
  'fire-golem-a',
  'fire-golem-b',
  'fire-golem-c',
  'tampora-a',
  'tampora-b',
  'tampora-c',
]

export const generateCharacter = (address: string) => {
  const hash = hashCode(address)

  return CHARACTERS[hash % CHARACTERS.length]
}
