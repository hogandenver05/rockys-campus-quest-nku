import { LIMITS } from '../config'

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
])

export function validateImageFile(file) {
  if (!file) return 'Choose a photo first.'
  if (!ALLOWED_TYPES.has(file.type)) {
    return 'Use a JPG, PNG, WebP, HEIC, or HEIF image.'
  }
  if (file.size > LIMITS.uploadBytes) {
    return 'That image is too large. Choose one under 12 MB.'
  }
  return ''
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('This photo could not be processed. Try a JPG or PNG instead.'))
    }
    img.src = url
  })
}

export async function prepareImage(file) {
  const validation = validateImageFile(file)
  if (validation) throw new Error(validation)

  const img = await loadImage(file)
  const scale = Math.min(1, LIMITS.maxDimension / Math.max(img.naturalWidth, img.naturalHeight))
  const width = Math.max(1, Math.round(img.naturalWidth * scale))
  const height = Math.max(1, Math.round(img.naturalHeight * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d', { alpha: false })
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, width, height)
  context.drawImage(img, 0, 0, width, height)

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.82))
  if (!blob) throw new Error('Could not prepare that photo for upload.')
  if (blob.size > LIMITS.processedBytes) {
    throw new Error('The processed image is still too large. Try a smaller photo.')
  }

  const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-_]+/g, '-').slice(0, 60) || 'rocky-photo'
  return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' })
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Could not preview the selected photo.'))
    reader.readAsDataURL(file)
  })
}
