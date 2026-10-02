export default function MissionCard({ mission }) {
  return (
    <section className="mission-card" aria-labelledby="mission-heading">
      <div>
        <p className="eyebrow">Passed forward</p>
        <h2 id="mission-heading">Your mission from the last finder</h2>
      </div>
      <blockquote>{mission || 'Be the first to leave a mission for whoever finds Rocky next.'}</blockquote>
    </section>
  )
}
