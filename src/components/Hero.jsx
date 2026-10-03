import RockMark from './RockMark'

export default function Hero({ rock, discoveryCount, onAddDiscovery }) {
  return (
    <section className="hero">
      <div className="hero__copy">
        <p className="eyebrow">{rock.eyebrow}</p>
        <h1>{rock.headline}</h1>
        <p className="hero__description">{rock.description}</p>
        <div className="hero__actions">
          <button className="button button--primary" type="button" onClick={onAddDiscovery}>
            Add my discovery
          </button>
          <a className="button button--ghost" href="#gallery">
            See Rocky's journey
          </a>
        </div>
        <div className="hero__stat" aria-label={`${discoveryCount} discoveries shared`}>
          <strong>{discoveryCount}</strong>
          <span>{discoveryCount === 1 ? 'discovery shared' : 'discoveries shared'}</span>
        </div>
      </div>
      <div className="hero__visual">
        <RockMark />
        <div className="hero__sticker">SCAN • SNAP • PASS IT ON!</div>
      </div>
    </section>
  )
}
