import DiscoveryCard from './DiscoveryCard'

export default function Gallery({ discoveries, loading, error, onRefresh, onAddDiscovery }) {
  return (
    <section className="gallery-section" id="gallery" aria-labelledby="gallery-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Shared history</p>
          <h2 id="gallery-heading">Rocky's journey</h2>
          <p>Every photo adds another chapter. New discoveries appear after a refresh.</p>
        </div>
        <button className="button button--small button--ghost" type="button" onClick={onRefresh} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh gallery'}
        </button>
      </div>

      {error && <div className="notice notice--error" role="alert">{error}</div>}

      {!loading && discoveries.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">✦</div>
          <h3>Rocky's story starts here.</h3>
          <p>No discoveries have been shared yet. Be the first person to leave a chapter behind.</p>
          <button className="button button--primary" type="button" onClick={onAddDiscovery}>Add the first discovery</button>
        </div>
      ) : (
        <div className="gallery-grid" aria-live="polite">
          {discoveries.map((discovery) => (
            <DiscoveryCard key={discovery.id} discovery={discovery} />
          ))}
        </div>
      )}
    </section>
  )
}
