import { formatDiscoveryDate } from '../utils/date'

export default function DiscoveryCard({ discovery }) {
  return (
    <article className="discovery-card">
      <div className="discovery-card__image-wrap">
        <img
          className="discovery-card__image"
          src={discovery.imageUrl}
          alt={discovery.caption ? `Rocky discovery: ${discovery.caption}` : 'A community member discovering Rocky'}
          loading="lazy"
        />
      </div>
      <div className="discovery-card__body">
        <div className="discovery-card__meta">
          <span>Rocky sighting</span>
          <time>{formatDiscoveryDate(discovery.createdAt)}</time>
        </div>
        {discovery.caption && <p className="discovery-card__caption">{discovery.caption}</p>}
        {discovery.mission && (
          <div className="discovery-card__mission">
            <span>For the next finder</span>
            <p>{discovery.mission}</p>
          </div>
        )}
      </div>
    </article>
  )
}
