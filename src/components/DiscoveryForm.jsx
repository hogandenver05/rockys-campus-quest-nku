import { useEffect, useMemo, useState } from 'react'
import { LIMITS } from '../config'
import { prepareImage, validateImageFile } from '../utils/image'

const COOLDOWN_MS = 30_000
const LAST_SUBMIT_KEY = 'rocky-last-submit-at'

export default function DiscoveryForm({ open, onClose, onSubmit, onSuccess, firebaseConfigured }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [caption, setCaption] = useState('')
  const [mission, setMission] = useState('')
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  const busy = status === 'preparing' || status === 'uploading'

  useEffect(() => {
    if (!file) {
      setPreview('')
      return undefined
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !busy) onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, busy, onClose])

  const submitLabel = useMemo(() => {
    if (status === 'preparing') return 'Preparing photo…'
    if (status === 'uploading') return `Sharing… ${progress}%`
    return 'Add my chapter'
  }, [status, progress])

  if (!open) return null

  function resetAndClose() {
    if (busy) return
    setFile(null)
    setCaption('')
    setMission('')
    setWebsite('')
    setError('')
    setProgress(0)
    setStatus('idle')
    onClose()
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (website) return
    const validation = validateImageFile(file)
    if (validation) {
      setError(validation)
      return
    }

    const lastSubmit = Number(localStorage.getItem(LAST_SUBMIT_KEY) || 0)
    if (Date.now() - lastSubmit < COOLDOWN_MS) {
      setError('Give Rocky about 30 seconds before submitting another discovery from this device.')
      return
    }

    try {
      setStatus('preparing')
      const preparedFile = await prepareImage(file)
      setStatus('uploading')
      await onSubmit({
        file: preparedFile,
        caption,
        mission,
        onProgress: setProgress,
      })
      localStorage.setItem(LAST_SUBMIT_KEY, String(Date.now()))
      setStatus('success')
    } catch (err) {
      setStatus('idle')
      setError(err?.message || 'Something went wrong while sharing your discovery.')
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && resetAndClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="discovery-form-title">
        {status === 'success' ? (
          <div className="success-state">
            <div className="success-state__icon">✓</div>
            <p className="eyebrow">Chapter added</p>
            <h2 id="discovery-form-title">You're part of Rocky's story now.</h2>
            <p>Your chapter is saved. Pass Rocky on when you’re ready—the next finder will see the mission you left.</p>
            <button className="button button--primary" type="button" onClick={() => { resetAndClose(); onSuccess?.() }}>View Rocky's journey</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal__header">
              <div>
                <p className="eyebrow">You found Rocky</p>
                <h2 id="discovery-form-title">Add your chapter to Rocky's journey.</h2>
              </div>
              <button className="icon-button" type="button" aria-label="Close" onClick={resetAndClose} disabled={busy}>×</button>
            </div>

            {!firebaseConfigured && (
              <div className="notice">
                <strong>Local demo mode.</strong> This browser will remember your test submissions, but other devices will not see them until Firebase is configured.
              </div>
            )}

            <label className="photo-picker">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                onChange={(event) => {
                  const next = event.target.files?.[0] || null
                  setFile(next)
                  setError(next ? validateImageFile(next) : '')
                }}
                disabled={busy}
              />
              {preview ? (
                <img src={preview} alt="Selected discovery preview" />
              ) : (
                <span>
                  <strong>Choose or take your Rocky photo</strong>
                  <small>JPG, PNG, WebP, HEIC or HEIF • up to 12 MB</small>
                </span>
              )}
            </label>

            <label className="field">
              <span>Caption <small>optional</small></span>
              <textarea
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                maxLength={LIMITS.caption}
                rows="3"
                placeholder="Where did Rocky end up? What was happening?"
                disabled={busy}
              />
              <small className="field__count">{caption.length}/{LIMITS.caption}</small>
            </label>

            <label className="field">
              <span>Mission for the next finder <small>optional</small></span>
              <textarea
                value={mission}
                onChange={(event) => setMission(event.target.value)}
                maxLength={LIMITS.mission}
                rows="3"
                placeholder="Give the next finder something fun to do with Rocky…"
                disabled={busy}
              />
              <small className="field__count">{mission.length}/{LIMITS.mission}</small>
            </label>

            <label className="honeypot" aria-hidden="true">
              Website
              <input tabIndex="-1" autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </label>

            {error && <div className="notice notice--error" role="alert">{error}</div>}

            <div className="modal__footer">
              <p>By sharing, you confirm you have permission to post this photo and understand it will be publicly visible.</p>
              <button className="button button--primary button--full" type="submit" disabled={busy || !file}>
                {submitLabel}
              </button>
              {busy && <progress className="upload-progress" max="100" value={progress}>{progress}%</progress>}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
