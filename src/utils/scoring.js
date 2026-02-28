// ── Palette — maximally distinct, vivid, true to each dimension ──────────────
//   Work:       sunny YELLOW      — focus, golden concentration
//   Loved:      rose PINK         — warmth, heart
//   Social:     fresh GREEN       — life, friends, energy
//   Productive: jazz BLUE         — depth, learning, clarity
//   Gym:        ember ORANGE      — heat, strength
//   Fap:        dark CHARCOAL PURPLE — weight, inward pull (used as mask)
export const DIM_COLORS = {
  work:       { h: 50,  s: 88, l: 60 },
  loved:      { h: 340, s: 72, l: 70 },
  social:     { h: 142, s: 58, l: 52 },
  productive: { h: 215, s: 72, l: 58 },
  gym:        { h: 25,  s: 90, l: 58 },
  smoking:    { h: 175, s: 62, l: 48 },  // cool teal = fresh air / clean
  fap:        { h: 270, s: 28, l: 32 },
}

export const DIM_LABELS = {
  work: 'Work', loved: 'Loved', social: 'Social',
  productive: 'Productive', gym: 'Gym', smoking: 'No Smoke', fap: 'Fap',
}

// ── Internal helpers ─────────────────────────────────────────────────────────

function gymToScore(val) {
  if (val === null || val === undefined) return null
  return val ? 5 : null   // rest day = don't add to gradient (not negative)
}

// smoke-free (false) = positive teal; smoked (true) = null (no teal) + avg penalty
function smokeToScore(val) {
  if (val === null || val === undefined) return null
  return val === false ? 5 : null
}

// Returns non-fap dims + fap metadata separately
function parseEntry(entry) {
  if (!entry) return { mainDims: [], fapLevel: 0, avg: null }

  const { fap = null, work = null, loved = null, social = null, productive = null, gym = null, smoking = null } = entry

  const mainDims = []
  const push = (key, score) => {
    if (score !== null) mainDims.push({ key, score, color: DIM_COLORS[key] })
  }

  push('work',       work)
  push('loved',      loved)
  push('social',     social)
  push('productive', productive)
  push('gym',        gymToScore(gym))
  push('smoking',    smokeToScore(smoking))

  // Weighted avg for overall tone (fap/smoke have weight but aren't gradient bands)
  const fapWeight   = !fap ? 0 : fap === 1 ? 1.5 : 3
  const fapScore    = !fap ? null : fap === 1 ? 2 : 0
  const smokeWeight = smoking === true ? 0.8 : 0
  const smokeScore  = smoking === true ? 1.5 : null

  const allDims = [...mainDims]
  if (fapScore !== null)   allDims.push({ key: 'fap',   score: fapScore,   weight: fapWeight   })
  if (smokeScore !== null) allDims.push({ key: 'smoke', score: smokeScore, weight: smokeWeight })

  const totalW = allDims.reduce((s, d) => s + (d.weight ?? 1), 0)
  const sumW   = allDims.reduce((s, d) => s + (d.score ?? 0) * (d.weight ?? 1), 0)
  const avg    = totalW > 0 ? sumW / totalW : null

  return { mainDims, fapLevel: fap ?? 0, avg }
}

// Adjust a color's saturation + lightness based on score intensity (0–5)
function scoreToHSL({ h, s, l }, score) {
  const t  = Math.max(0, Math.min(5, score)) / 5
  const cS = Math.round(s * (0.42 + t * 0.58))
  const cL = Math.round(l + (1 - t) * 8 - t * 6)
  return `hsl(${h},${cS}%,${cL}%)`
}

// ── Public: gradient for full-size calendar cells ────────────────────────────

export function dayToGradient(entry) {
  const { mainDims, fapLevel, avg } = parseEntry(entry)
  if (mainDims.length === 0 && fapLevel === 0) return null

  let baseGradient

  if (mainDims.length === 0) {
    // Only fap logged — flat dark purple
    baseGradient = `hsl(270, 30%, 58%)`

  } else if (mainDims.length === 1) {
    // Single dimension — vivid radial bloom
    const { h, s, l } = mainDims[0].color
    const t  = mainDims[0].score / 5
    const cS = Math.round(s * (0.5 + t * 0.5))
    const cL = Math.round(l + (1 - t) * 8 - t * 6)
    const eS = Math.round(cS * 0.32)
    const eL = Math.min(cL + 22, 93)
    baseGradient = `radial-gradient(ellipse 85% 80% at 50% 55%, hsl(${h},${cS}%,${cL}%) 0%, hsl(${h},${eS}%,${eL}%) 100%)`

  } else {
    // Multi-dim — diagonal band gradient (bottom-left → top-right)
    // Sort by score desc so highest-rated color is most prominent at start
    const sorted = [...mainDims].sort((a, b) => b.score - a.score)
    const top    = sorted.slice(0, 4)   // max 4 bands (more gets muddy)

    // Each band proportional to its score share
    const total  = top.reduce((s, d) => s + Math.max(d.score, 0.5), 0)
    const stops  = []
    let pos = 0

    top.forEach((d, i) => {
      const color = scoreToHSL(d.color, d.score)
      const pct   = Math.round((Math.max(d.score, 0.5) / total) * 100)

      if (i === 0) stops.push(`${color} 0%`)
      pos += pct
      stops.push(`${color} ${Math.min(pos, 100)}%`)
    })

    baseGradient = `linear-gradient(135deg, ${stops.join(', ')})`
  }

  // ── Fap mask: dark charcoal-purple overlay, scales with fap count ──
  if (fapLevel >= 1) {
    const opacity = fapLevel === 1 ? 0.26 : 0.50   // 2+ = much heavier shadow
    return `linear-gradient(rgba(30,10,55,${opacity}), rgba(30,10,55,${opacity})), ${baseGradient}`
  }

  return baseGradient
}

// ── Public: border color for calendar cells ──────────────────────────────────
// Returns the dominant dimension's color at moderate saturation as a CSS string

export function dayToBorderColor(entry) {
  const { mainDims, fapLevel, avg } = parseEntry(entry)

  if (mainDims.length === 0 && fapLevel === 0) return null

  if (mainDims.length === 0) return `hsl(270, 35%, 45%)`

  // Dominant = highest scorer
  const dom = mainDims.reduce((best, d) => d.score > best.score ? d : best, mainDims[0])
  const { h, s, l } = dom.color
  const t = dom.score / 5
  const bS = Math.round(s * (0.55 + t * 0.35))
  const bL = Math.round(l - t * 8)

  // If fap heavy, shift border toward purple
  if (fapLevel >= 2) return `hsl(${h + 20},${bS - 10}%,${bL - 5}%)`
  return `hsl(${h},${bS}%,${bL}%)`
}

// ── Public: flat single color for tiny year-view mini cells ─────────────────

export function dayToFlatColor(entry) {
  const { mainDims, fapLevel } = parseEntry(entry)

  if (mainDims.length === 0 && fapLevel === 0) return null
  if (mainDims.length === 0) return `hsl(270, 28%, 55%)`

  const dom = mainDims.reduce((best, d) => d.score > best.score ? d : best, mainDims[0])
  const { h, s, l } = dom.color
  const t  = dom.score / 5
  const cS = Math.round(s * (0.5 + t * 0.5))
  const cL = Math.round(l + (1 - t) * 8 - t * 5)

  if (fapLevel >= 2) return `hsl(${h + 15},${cS - 15}%,${cL - 8}%)`
  if (fapLevel === 1) return `hsl(${h + 8},${cS - 8}%,${cL - 3}%)`
  return `hsl(${h},${cS}%,${cL}%)`
}

// ── Legacy helpers ───────────────────────────────────────────────────────────

export function scoreDay(entry) {
  const { avg } = parseEntry(entry)
  return avg
}

export function scoreTier(score) {
  if (score === null) return null
  if (score === 0)   return 0
  if (score < 1.5)  return 1
  if (score < 2.5)  return 2
  if (score < 3.5)  return 3
  if (score < 4.5)  return 4
  return 5
}

// kept for any component that still imports it
export function computeDayColor(entry) {
  const { mainDims, avg } = parseEntry(entry)
  if (!mainDims.length) return null
  const dom = mainDims.reduce((best, d) => d.score > best.score ? d : best, mainDims[0])
  return { avg: avg ?? 0, dominantKey: dom.key, color: dom.color }
}
