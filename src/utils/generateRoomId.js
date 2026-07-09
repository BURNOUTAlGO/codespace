const CHARS = 'abcdefghijkmnpqrstuvwxyz23456789' // no confusing chars (l, 1, 0, o)

export function generateRoomId(length = 7) {
  let id = ''
  for (let i = 0; i < length; i++) {
    id += CHARS[Math.floor(Math.random() * CHARS.length)]
  }
  return id
}