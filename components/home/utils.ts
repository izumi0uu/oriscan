const mimeTypes: Record<string, string[]> = {
  // Safe Images https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#image_types
  image: [
    'image/apng',
    'image/avif',
    'image/gif',
    'image/jpg',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'image/webp',
  ],
  audio: ['audio/midi', 'audio/mod', 'audio/mpeg'],
  video: ['video/mp4', 'video/webm'],
  text: ['text/html', 'text/markdown', 'text/plain'],
  binary: ['application/epub+zip', 'application/json', 'application/pdf', 'application/pgp-signature'],
}

export const getFileType = (content_type: string) => {
  let res: string = ''
  Object.keys(mimeTypes).filter((key) => {
    mimeTypes[key].filter((type) => {
      if (content_type.includes(type)) {
        res = key
      }
    })
  })
  return res
}
