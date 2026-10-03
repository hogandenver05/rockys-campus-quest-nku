import { useEffect, useState } from 'react'
import DiscoveryForm from './DiscoveryForm'
import MissionCard from './MissionCard'
import RockMark from './RockMark'

const REVEAL_DURATION_MS = 2200

export default function FoundView({ mission, loading, error, onSubmit, firebaseConfigured }) {
  const [revealComplete, setRevealComplete] = useState(false)
  const [formOpen, setFormOpen] = useState(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setRevealComplete(true)
      return undefined
    }

    const timer = window.setTimeout(() => setRevealComplete(true), REVEAL_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [])

  function viewGallery() {
    window.location.assign('/#gallery')
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="/" aria-label="Rocky home">
          <RockMark compact />
          <span>ROCKY</span>
        </a>
        <a className="button button--small button--ghost" href="/#gallery">
          View gallery
        </a>
      </header>

      <main className="found-page">
        {!firebaseConfigured && (
          <div className="demo-banner">
            <strong>Developer preview:</strong> Firebase isn't configured yet, so submissions are stored only in this browser.
          </div>
        )}

        <section className={`found-reveal${revealComplete ? ' is-ready' : ''}`} aria-labelledby="found-heading">
          <div className="found-reveal__panel">
            <div className="found-reveal__sparkles" aria-hidden="true">
              <span>✦</span>
              <span>✦</span>
              <span>✦</span>
              <span>✦</span>
              <span>✦</span>
              <span>✦</span>
            </div>

            <div className="found-reveal__rock">
              <RockMark />
            </div>

            <div className="found-reveal__copy">
              <p className="eyebrow">Rocky's Campus Quest - NKU</p>
              <h1 id="found-heading">You found me!!</h1>
              <p>You're officially part of Rocky's journey.</p>
            </div>

            <div className="found-reveal__actions">
              <a className="button button--primary" href="#your-turn">
                Continue Rocky's journey
              </a>
              <a className="button button--ghost" href="/#gallery">
                See the gallery
              </a>
            </div>
          </div>
        </section>

        {revealComplete && (
          <div className="content-shell found-content" id="your-turn">
            {error && <div className="notice notice--error" role="alert">{error}</div>}

            <MissionCard mission={loading ? 'Checking Rocky’s last mission…' : mission} />

            <section className="found-turn" aria-labelledby="found-turn-heading">
              <div>
                <p className="eyebrow">Your turn</p>
                <h2 id="found-turn-heading">Add your chapter, then pass Rocky on.</h2>
                <p>Take a photo, add a caption, and leave a mission for whoever discovers Rocky next.</p>
              </div>
              <button className="button button--primary" type="button" onClick={() => setFormOpen(true)}>
                Add my chapter
              </button>
            </section>
          </div>
        )}
      </main>

      <footer className="site-footer">
        <RockMark compact />
        <p>Built for the NKU Fall 2026 Hackathon. Rocky belongs to the community.</p>
      </footer>

      <DiscoveryForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={onSubmit}
        onSuccess={viewGallery}
        firebaseConfigured={firebaseConfigured}
      />
    </>
  )
}
