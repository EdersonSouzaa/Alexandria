export default function OwlLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="32" fill="var(--dark-navy)" />
      <path
        d="M32 12c-9 0-15 7-15 17 0 8 4 14 8 17l1-6c-3-3-5-7-5-11 0-8 5-13 11-13s11 5 11 13c0 4-2 8-5 11l1 6c4-3 8-9 8-17 0-10-6-17-15-17z"
        fill="var(--cyan)"
      />
      <circle cx="25" cy="27" r="6" fill="var(--dark-navy)" />
      <circle cx="39" cy="27" r="6" fill="var(--dark-navy)" />
      <circle cx="25" cy="27" r="2.4" fill="var(--cyan)" />
      <circle cx="39" cy="27" r="2.4" fill="var(--cyan)" />
      <path d="M32 30l-3 5h6z" fill="var(--dark-navy)" />
    </svg>
  )
}
