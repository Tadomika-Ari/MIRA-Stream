import React, { useMemo, useState } from "react"

type EpisodeItem = {
  name: string
  path: string
}

type SeasonGroup = {
  name: string
  episodes: EpisodeItem[]
}

type BiblioItem = {
  name?: string
  type?: string
  totalseason?: number
  nbseason?: number
  pathepisode?: string[]
  Name?: string
  Type?: string
  TotalSeason?: number
  NbEpisode?: number
  PathEpisode?: string[]
}

type BiblioDrawerProps = {
  biblio: BiblioItem | null
  open: boolean
  onClose: () => void
  onPlayEpisode?: (episodePath: string) => void
}

function groupEpisodesBySeason(biblio: BiblioItem | null): SeasonGroup[] {
  const grouped = new Map()

  const episodePaths = biblio?.pathepisode ?? biblio?.PathEpisode

  if (!Array.isArray(episodePaths)) {
    return []
  }

  episodePaths.forEach((episodePath: string) => {
    const normalizedPath = String(episodePath)
    const pathParts = normalizedPath.split("/")
    const seasonName = pathParts.find((part) => /^Season/i.test(part)) || "Season"
    const episodeName = pathParts[pathParts.length - 1] || normalizedPath

    if (!grouped.has(seasonName)) {
      grouped.set(seasonName, [])
    }

    grouped.get(seasonName).push({
      name: episodeName,
      path: normalizedPath,
    })
  })

  return Array.from(grouped.entries()).map(([seasonName, episodes]) => ({
    name: seasonName,
    episodes,
  }))
}

export default function BiblioDrawer({ biblio, open, onClose, onPlayEpisode }: BiblioDrawerProps) {
  const seasons = useMemo(() => groupEpisodesBySeason(biblio), [biblio])
  const [selectedSeason, setSelectedSeason] = useState(0)
  const totalSeason = biblio?.totalseason ?? biblio?.TotalSeason ?? 0
  const totalEpisode = biblio?.nbseason ?? biblio?.NbEpisode ?? 0

  if (!open || !biblio) {
    return null
  }

  const activeSeason = seasons[selectedSeason] || seasons[0]

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4 py-6 sm:px-6">
      <button
        type="button"
        aria-label="Fermer la bibliotheque"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside className="relative flex h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/95 px-6 py-6 text-white shadow-2xl shadow-black/50">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Bibliotheque</p>
            <h2 className="mt-2 text-3xl font-semibold">{biblio.name ?? biblio.Name}</h2>
            <p className="mt-2 text-sm text-zinc-300">
              {totalSeason} saison{totalSeason > 1 ? "s" : ""} · {totalEpisode} episode{totalEpisode > 1 ? "s" : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/10"
          >
            Fermer
          </button>
        </div>

        <div className="mt-6 grid flex-1 gap-6 overflow-hidden lg:grid-cols-[220px_1fr]">
          <div className="space-y-3 overflow-y-auto pr-1">
            <p className="text-sm font-semibold text-zinc-200">Saisons</p>
            <div className="grid gap-2">
              {seasons.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
                  Aucun episode indexe pour le moment.
                </div>
              ) : (
                seasons.map((season, index) => (
                  <button
                    key={season.name}
                    type="button"
                    onClick={() => setSelectedSeason(index)}
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      index === selectedSeason
                        ? "border-amber-300/60 bg-amber-300/15 text-white"
                        : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
                    }`}
                  >
                    <span className="block text-sm font-semibold">{season.name}</span>
                    <span className="block text-xs text-zinc-400">
                      {season.episodes.length} episode{season.episodes.length > 1 ? "s" : ""}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="min-h-0 overflow-y-auto rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
              <div>
                <p className="text-sm text-zinc-400">Selection actuelle</p>
                <h3 className="text-2xl font-semibold text-white">{activeSeason?.name || "Aucune saison"}</h3>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-300">
                {activeSeason?.episodes.length || 0} episode{(activeSeason?.episodes.length || 0) > 1 ? "s" : ""}
              </span>
            </div>

            <div className="mt-4 grid gap-3">
              {(activeSeason?.episodes || []).map((episode: EpisodeItem, index: number) => (
                <button
                  key={episode.path}
                  type="button"
                  onClick={() => onPlayEpisode?.(episode.path)}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-900/70 px-4 py-3 text-left transition hover:border-amber-300/50 hover:bg-zinc-900"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      Episode {index + 1}
                    </p>
                    <p className="text-xs text-zinc-400">{episode.name}</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.24em] text-amber-200">Play</span>
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-black/20 p-4 text-sm text-zinc-300">
              Next...
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}