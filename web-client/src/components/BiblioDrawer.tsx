import React, { useEffect, useMemo, useState } from "react"
import { getApiBase } from "../lib/api"
import "./BiblioDrawer.css"

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

type BiblioInfo = {
  synopsis?: string
  banner?: string
  score?: number
  statut?: string
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
  const [info_anime, setInfoAnime] = useState<BiblioInfo>({})

  useEffect(() => {
  if (!biblio || !open) return  // ne fetch que quand le drawer s'ouvre

  const fetchInfo = async () => {
    try {
      const animeName = biblio.name ?? biblio.Name ?? ''
      const res = await fetch(`${getApiBase()}/jikan/${encodeURIComponent(animeName)}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      if (!data?.data?.[0]) return
      setInfoAnime({
        synopsis: data.data[0].synopsis,
        score: data.data[0].score,
        banner: data.data[0].images?.webp?.image_url
      })
    } catch (err) {
      console.error('Erreur requête:', err)
    }
  }
  fetchInfo()
}, [biblio, open])  // re-fetch à chaque fois qu'on ouvre un nouvel item

  if (!open || !biblio) {
    return null
  }

  const activeSeason = seasons[selectedSeason] || seasons[0]
  return (
    <div className="drawer-overlay">
      <button
        type="button"
        aria-label="Fermer la bibliotheque"
        className="drawer-backdrop"
        onClick={onClose}
      />

      <aside className="drawer-panel">
        <div className="drawer-header">
          <div>
            <p className="drawer-eyebrow">Bibliothèque</p>
            <h2>{biblio.name ?? biblio.Name}</h2>
            <p className="drawer-muted">
              {totalSeason} saison{totalSeason > 1 ? "s" : ""} · {totalEpisode} episode{totalEpisode > 1 ? "s" : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="drawer-close"
          >
            Fermer
          </button>
        </div>

        <div className="drawer-body">
          <div className="drawer-seasons">
            <p className="drawer-label">Saisons</p>
            <div className="grid gap-2">
              {seasons.length === 0 ? (
                <div className="drawer-empty">
                  Aucun episode indexe pour le moment.
                </div>
              ) : (
                seasons.map((season, index) => (
                  <button
                    key={season.name}
                    type="button"
                    onClick={() => setSelectedSeason(index)}
                    className={`drawer-season ${
                      index === selectedSeason
                        ? "selected"
                        : ""
                    }`}
                  >
                    <span>{season.name}</span>
                    <small>
                      {season.episodes.length} episode{season.episodes.length > 1 ? "s" : ""}
                    </small>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="drawer-content">
            <div className="drawer-content-header">
              <div>
                <p className="drawer-muted">Sélection actuelle</p>
                <h3>{activeSeason?.name || "Aucune saison"}</h3>
              </div>
              <span className="drawer-count">
                {activeSeason?.episodes.length || 0} episode{(activeSeason?.episodes.length || 0) > 1 ? "s" : ""}
              </span>
            </div>

            <div className="episode-list">
              {(activeSeason?.episodes || []).map((episode: EpisodeItem, index: number) => (
                <button
                  key={episode.path}
                  type="button"
                  onClick={() => onPlayEpisode?.(episode.path)}
                  className="episode-row"
                >
                  <div>
                    <p>
                      Episode {index + 1}
                    </p>
                    <small>{episode.name}</small>
                  </div>
                  <span>Play</span>
                </button>
              ))}
            </div>

            <div className="drawer-info">
              <p><strong>Synopsis</strong>{info_anime.synopsis || 'Aucune synopsis disponible.'}</p>
              <p><strong>Score</strong>{info_anime.score || 'Non classé'}</p>
              {info_anime.banner && <img src={info_anime.banner} alt="Affiche de la série" />}
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}