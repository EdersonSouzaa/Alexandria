export function SkelLine({ width = '100%', height = 14, radius = 6, style, className = '' }) {
  return (
    <span
      className={`dash__skel dash__skel--line ${className}`.trim()}
      style={{ width, height, borderRadius: radius, ...style }}
      aria-hidden="true"
    />
  )
}

const Line = SkelLine

export function PageHeadSkeleton({ withFilters = true }) {
  return (
    <div className="dash__page-head" aria-hidden="true">
      <div>
        <Line width={220} height={30} style={{ marginBottom: 10 }} />
        <Line width={260} height={16} />
      </div>
      {withFilters && (
        <div className="dash__filters">
          <Line width={170} height={42} radius="var(--dash-radius-sm)" />
          <Line width={130} height={42} radius="var(--dash-radius-sm)" />
        </div>
      )}
    </div>
  )
}

export function StatsSkeleton({ count = 4, wide = false }) {
  return (
    <div className={`dash__stats${wide ? ' dash__stats--wide' : ''}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div className="dash__stat-tile" key={i}>
          {!wide && <span className="dash__stat-tile-icon dash__skel" />}
          <span style={{ flex: 1 }}>
            <Line width="50%" height={20} style={{ marginBottom: 8 }} />
            <Line width="75%" height={12} />
          </span>
        </div>
      ))}
    </div>
  )
}

export function BookCardSkeleton() {
  return (
    <div className="dash__book" aria-hidden="true">
      <div className="dash__book-cover dash__skel" />
      <div className="dash__book-ledge" />
      <div className="dash__book-info">
        <Line width="85%" height={18} style={{ marginBottom: 6 }} />
        <Line width="55%" height={13} />
      </div>
    </div>
  )
}

export function BookGridSkeleton({ count = 10, compact = false }) {
  return (
    <div className={`dash__book-grid${compact ? ' dash__book-grid--compact' : ''}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function ReviewCardSkeleton() {
  return (
    <article className="dash__review" aria-hidden="true">
      <div className="dash__review-cover dash__skel" />
      <div className="dash__review-body">
        <div className="dash__review-head">
          <div style={{ flex: 1 }}>
            <Line width="60%" height={22} style={{ marginBottom: 10 }} />
            <Line width="35%" height={13} />
          </div>
          <Line width={90} height={16} />
        </div>
        <div className="dash__review-quote">
          <Line width="100%" height={13} style={{ marginBottom: 8 }} />
          <Line width="90%" height={13} style={{ marginBottom: 8 }} />
          <Line width="70%" height={13} />
        </div>
        <div className="dash__review-foot">
          <Line width={140} height={13} />
        </div>
      </div>
    </article>
  )
}

export function ReviewsSkeleton({ count = 3 }) {
  return (
    <div className="dash__reviews" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <ReviewCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function RevCardSkeleton() {
  return (
    <article className="dash__revcard" aria-hidden="true">
      <div className="dash__revcard-head">
        <div className="dash__revcard-who">
          <span className="dash__revcard-avatar dash__skel" />
          <div>
            <Line width={110} height={16} style={{ marginBottom: 6 }} />
            <Line width={70} height={12} />
          </div>
        </div>
        <Line width={90} height={16} />
      </div>
      <Line width="100%" height={13} style={{ marginTop: 16, marginBottom: 8 }} />
      <Line width="80%" height={13} />
    </article>
  )
}

export function RevCardsSkeleton({ count = 2 }) {
  return (
    <div className="dash__reviews" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <RevCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function PostCardSkeleton() {
  return (
    <article className="dash__post" aria-hidden="true">
      <div className="dash__post-head">
        <span className="dash__post-avatar dash__skel" />
        <div>
          <Line width={130} height={16} style={{ marginBottom: 6 }} />
          <Line width={90} height={12} />
        </div>
      </div>
      <Line width="100%" height={13} style={{ marginTop: 18, marginBottom: 8 }} />
      <Line width="92%" height={13} style={{ marginBottom: 8 }} />
      <Line width="60%" height={13} />
    </article>
  )
}

export function PostsSkeleton({ count = 3 }) {
  return (
    <div className="dash__posts" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function BadgeTileSkeleton() {
  return (
    <div className="dash__badge-tile" aria-hidden="true">
      <span className="dash__badge-tile-icon dash__skel" />
      <Line width="70%" height={14} style={{ marginTop: 12, marginBottom: 6 }} />
      <Line width="90%" height={11} />
    </div>
  )
}

export function BadgesSkeleton({ count = 8 }) {
  return (
    <div className="dash__badges-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <BadgeTileSkeleton key={i} />
      ))}
    </div>
  )
}

export function TimelineSkeleton({ count = 5, compact = false }) {
  return (
    <div className={`dash__timeline${compact ? ' dash__timeline--compact' : ''}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div className="dash__timeline-item" key={i}>
          <span className="dash__timeline-icon dash__skel" />
          <span className="dash__timeline-desc dash__skel dash__skel--line" style={{ maxWidth: '55%' }} />
          <span className="dash__timeline-meta dash__skel dash__skel--line" style={{ width: 110 }} />
        </div>
      ))}
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <section className="dash__hero" aria-hidden="true" style={{ background: 'var(--dash-surface-container)' }}>
      <div className="dash__hero-content">
        <Line width={140} height={22} radius={999} style={{ marginBottom: 18 }} />
        <Line width="70%" height={32} style={{ marginBottom: 14 }} />
        <Line width="45%" height={16} style={{ marginBottom: 40 }} />
        <Line width={170} height={46} radius={999} />
      </div>
      <div className="dash__hero-visual">
        <div className="dash__hero-cover dash__skel" style={{ backgroundColor: 'var(--dash-surface-highest)' }} />
      </div>
    </section>
  )
}

export function LevelHeroSkeleton() {
  return (
    <section className="dash__level-hero" aria-hidden="true">
      <div className="dash__level-hero-main">
        <span className="dash__skel" style={{ width: 176, height: 176, borderRadius: '50%', flexShrink: 0 }} />
        <div className="dash__level-hero-copy" style={{ flex: 1 }}>
          <Line width="55%" height={26} style={{ marginBottom: 16 }} />
          <Line width="90%" height={16} style={{ marginBottom: 8 }} />
          <Line width="70%" height={16} style={{ marginBottom: 20 }} />
          <div style={{ display: 'flex', gap: 10 }}>
            <Line width={130} height={28} radius={999} />
            <Line width={170} height={28} radius={999} />
          </div>
        </div>
      </div>
      <div className="dash__rank-card" style={{ background: 'var(--dash-surface-container)' }}>
        <Line width={90} height={12} style={{ marginBottom: 12 }} />
        <Line width="70%" height={22} style={{ marginBottom: 20 }} />
        <Line width="100%" height={8} radius={999} />
      </div>
    </section>
  )
}

export function BookHeroSkeleton() {
  return (
    <section className="dash__book-hero" aria-hidden="true">
      <div className="dash__book-hero-visual">
        <div className="dash__book-hero-cover dash__skel" />
        <div className="dash__spec-grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <div className="dash__spec-tile" key={i}>
              <Line width={20} height={20} radius="50%" style={{ marginBottom: 6 }} />
              <Line width="65%" height={10} style={{ marginBottom: 6 }} />
              <Line width="40%" height={15} />
            </div>
          ))}
        </div>
      </div>
      <div className="dash__book-hero-info">
        <Line width={100} height={22} radius={999} style={{ marginBottom: 18 }} />
        <Line width="75%" height={30} style={{ marginBottom: 12 }} />
        <Line width="40%" height={16} style={{ marginBottom: 26 }} />
        <Line width="100%" height={13} style={{ marginBottom: 8 }} />
        <Line width="95%" height={13} style={{ marginBottom: 8 }} />
        <Line width="80%" height={13} style={{ marginBottom: 26 }} />
        <div style={{ display: 'flex', gap: 12 }}>
          <Line width={190} height={42} radius={999} />
          <Line width={42} height={42} radius="50%" />
          <Line width={42} height={42} radius="50%" />
        </div>
      </div>
    </section>
  )
}

export function CrumbsSkeleton() {
  return (
    <div className="dash__crumbs" aria-hidden="true">
      <Line width={70} height={12} />
      <Line width={90} height={12} />
    </div>
  )
}

export function ProfileHeaderSkeleton() {
  return (
    <section className="dash__profile-header" aria-hidden="true">
      <span className="dash__profile-avatar dash__skel" />
      <div className="dash__profile-header-info" style={{ flex: 1 }}>
        <Line width={200} height={24} style={{ marginBottom: 12 }} />
        <Line width={160} height={14} style={{ marginBottom: 14 }} />
        <Line width={220} height={20} radius={999} />
      </div>
    </section>
  )
}

export function QuickCardsSkeleton({ count = 3 }) {
  return (
    <div className="dash__quick" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div className="dash__quick-card" key={i}>
          <span className="dash__quick-icon dash__skel" />
          <span style={{ flex: 1 }}>
            <Line width="65%" height={15} style={{ marginBottom: 6 }} />
            <Line width="45%" height={12} />
          </span>
        </div>
      ))}
    </div>
  )
}

export function ShelfSkeleton({ count = 4 }) {
  return (
    <div className="dash__shelf" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div className="dash__tile dash__skel" key={i} style={{ backgroundColor: 'var(--dash-surface-high)' }} />
      ))}
    </div>
  )
}

export function LevelCardSkeleton() {
  return (
    <div className="dash__level-card" style={{ background: 'var(--dash-surface-container)' }} aria-hidden="true">
      <div className="dash__level-top">
        <Line width={90} height={20} />
        <Line width={80} height={20} radius={999} />
      </div>
      <Line width="70%" height={12} style={{ marginBottom: 14 }} />
      <Line width="100%" height={8} radius={999} style={{ marginBottom: 20 }} />
      <div className="dash__badges">
        {Array.from({ length: 3 }).map((_, i) => (
          <div className="dash__badge" key={i}>
            <span className="dash__badge-icon dash__skel" />
            <Line width="80%" height={10} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function FeedListSkeleton({ count = 3 }) {
  return (
    <div aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div className="dash__feed-item" key={i}>
          <span className="dash__feed-avatar dash__skel" />
          <span className="dash__feed-text">
            <Line width="55%" height={14} style={{ marginBottom: 6 }} />
            <Line width="85%" height={12} />
          </span>
        </div>
      ))}
    </div>
  )
}
