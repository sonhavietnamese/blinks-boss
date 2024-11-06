const DICTIONARY = '0123456789abcdefghijklmnopqrstuvwxyz'

export function uuid() {
  return Array.from({ length: 10 }, () => DICTIONARY[Math.floor(Math.random() * DICTIONARY.length)]).join('')
}
