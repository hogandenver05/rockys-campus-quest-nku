import { signInAnonymously } from 'firebase/auth'
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from 'firebase/storage'
import { auth, db, isFirebaseConfigured, storage } from '../firebase'
import { ROCK } from '../config'
import { fileToDataUrl } from '../utils/image'

const DEMO_KEY = 'rocky-demo-discoveries-v1'

function loadDemoDiscoveries() {
  try {
    return JSON.parse(localStorage.getItem(DEMO_KEY) || '[]')
  } catch {
    return []
  }
}

function saveDemoDiscoveries(items) {
  localStorage.setItem(DEMO_KEY, JSON.stringify(items.slice(0, 12)))
}

async function ensureAnonymousUser() {
  if (auth.currentUser) return auth.currentUser
  const result = await signInAnonymously(auth)
  return result.user
}

export async function listDiscoveries() {
  if (!isFirebaseConfigured) {
    return loadDemoDiscoveries().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  const snapshot = await getDocs(
    query(collection(db, 'discoveries'), orderBy('createdAt', 'desc'), limit(40)),
  )

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export async function createDiscovery({ file, caption, mission, onProgress }) {
  if (!isFirebaseConfigured) {
    const imageUrl = await fileToDataUrl(file)
    const item = {
      id: crypto.randomUUID(),
      rockId: ROCK.id,
      imageUrl,
      imagePath: 'local-demo',
      caption: caption.trim(),
      mission: mission.trim(),
      createdAt: new Date().toISOString(),
      createdBy: 'local-demo',
    }
    const current = loadDemoDiscoveries()
    saveDemoDiscoveries([item, ...current])
    onProgress?.(100)
    return item
  }

  const user = await ensureAnonymousUser()
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
  const path = `discoveries/${user.uid}/${Date.now()}-${safeName}`
  const storageRef = ref(storage, path)
  let uploaded = false

  try {
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
      cacheControl: 'public,max-age=31536000,immutable',
    })

    await new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          onProgress?.(pct)
        },
        reject,
        resolve,
      )
    })
    uploaded = true

    const imageUrl = await getDownloadURL(storageRef)
    const payload = {
      rockId: ROCK.id,
      imageUrl,
      imagePath: path,
      caption: caption.trim(),
      mission: mission.trim(),
      createdAt: serverTimestamp(),
      createdBy: user.uid,
    }

    const docRef = await addDoc(collection(db, 'discoveries'), payload)
    return { id: docRef.id, ...payload }
  } catch (error) {
    if (uploaded) {
      try {
        await deleteObject(storageRef)
      } catch {
        // Cleanup is best-effort; the original upload error is more useful to the user.
      }
    }
    throw error
  }
}
