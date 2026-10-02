export default function RockMark({ compact = false }) {
  return (
    <div className={compact ? 'rock-mark rock-mark--compact' : 'rock-mark'} aria-hidden="true">
      <div className="rock-mark__face">
        <span className="rock-mark__eye rock-mark__eye--left" />
        <span className="rock-mark__eye rock-mark__eye--right" />
        <span className="rock-mark__smile" />
      </div>
      <span className="rock-mark__spark rock-mark__spark--one">✦</span>
      <span className="rock-mark__spark rock-mark__spark--two">✦</span>
    </div>
  )
}
