import { useCallback, useEffect, useMemo, useState } from 'react'
import { ROCK } from './config'
import { isFirebaseConfigured } from './firebase'
import { createDiscovery, listDiscoveries } from './services/discoveries'
import DiscoveryForm from './components/DiscoveryForm'
import Gallery from './components/Gallery'
import Hero from './components/Hero'
import MissionCard from './components/MissionCard'
import RockMark from './components/RockMark'

export default function App() {
  const [discoveries, setDiscoveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formOpen, setFormOpen] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const items = await listDiscoveries()
      setDiscoveries(items)
    } catch (err) {
      setError(err?.message || 'Rocky could not load the gallery right now.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const latestMission = useMemo(
    () => discoveries.find((item) => item.mission?.trim())?.mission || '',
    [discoveries],
  )

  async function handleSubmit(payload) {
    await createDiscovery(payload)
    await refresh()
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Rocky home">
          <RockMark compact />
          <span>ROCKY</span>
        </a>
        <button className="button button--small button--primary" type="button" onClick={() => setFormOpen(true)}>
          I found Rocky
        </button>
      </header>

      <main id="top">
        {!isFirebaseConfigured && (
          <div className="demo-banner">
            <strong>Developer preview:</strong> Firebase isn't configured yet, so submissions are stored only in this browser.
          </div>
        )}

        <Hero
          rock={ROCK}
          discoveryCount={discoveries.length}
          onAddDiscovery={() => setFormOpen(true)}
        />

        <div className="content-shell">
          <MissionCard mission={latestMission} />
          <section className="how-it-works" aria-labelledby="how-heading">
            <div className="section-heading section-heading--compact">
              <div>
                <p className="eyebrow">One object. Many people.</p>
                <h2 id="how-heading">How Rocky works</h2>
              </div>
            </div>
            <div className="steps">
              <article><span>01</span><h3>Find</h3><p>Spot Rocky in the real world and scan the QR code.</p></article>
              <article><span>02</span><h3>Share</h3><p>Add a photo and a short caption. No profile required.</p></article>
              <article><span>03</span><h3>Pass it on</h3><p>Leave a mission for the next person who finds Rocky.</p></article>
            </div>
          </section>
          <Gallery
            discoveries={discoveries}
            loading={loading}
            error={error}
            onRefresh={refresh}
            onAddDiscovery={() => setFormOpen(true)}
          />
        </div>
      </main>

      <footer className="site-footer">
        <RockMark compact />
        <p>Built for the NKU Fall 2026 Hackathon. Rocky belongs to the community.</p>
      </footer>

      <DiscoveryForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        firebaseConfigured={isFirebaseConfigured}
      />
    </>
  )
}
