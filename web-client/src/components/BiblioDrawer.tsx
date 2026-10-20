import React, { useEffect, useMemo, useState } from "react"
import { getApiBase } from "../lib/api"

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
    <div className="fixed inset-0 z-40 flex items-center justify-center p-6 font-['DM_Sans'] text-[#f6f3ed] max-[700px]:p-2.5">
      <button
        type="button"
        aria-label="Fermer la bibliotheque"
        className="absolute inset-0 cursor-pointer border-0 bg-[rgba(3,5,10,.78)] backdrop-blur-[8px]"
        onClick={onClose}
      />

      <aside className="relative flex h-[88vh] w-full max-w-[1040px] flex-col overflow-hidden rounded-[10px] border border-[#2c3243] bg-[#0e111b] shadow-[0_24px_80px_#0009] max-[700px]:h-[94vh]">
        <div className="flex items-start justify-between gap-5 border-b border-[#252b3b] px-[30px] pb-5 pt-[26px] max-[700px]:px-[18px] max-[700px]:pb-[15px] max-[700px]:pt-5">
          <div>
            <p className="mb-[9px] font-['Space_Grotesk'] text-[10px] font-bold tracking-[.2em] text-[#ffba62]">Bibliothèque</p>
            <h2 className="m-0 font-['Space_Grotesk'] text-[30px] font-semibold text-white max-[700px]:text-2xl">{biblio.name ?? biblio.Name}</h2>
            <p className="mt-2 text-xs text-[#7d8497]">
              {totalSeason} saison{totalSeason > 1 ? "s" : ""} · {totalEpisode} episode{totalEpisode > 1 ? "s" : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-[5px] border border-[#333a4b] bg-[#171b27] px-[13px] py-[9px] text-xs text-[#d7dae1] hover:border-[#ffba62] hover:text-[#ffba62]"
          >
            Fermer
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[220px_1fr] gap-[22px] px-[30px] pb-[30px] pt-[23px] max-[700px]:flex max-[700px]:flex-col max-[700px]:gap-[15px] max-[700px]:px-[18px] max-[700px]:pb-[18px] max-[700px]:pt-4">
          <div className="min-h-0 overflow-y-auto max-[700px]:max-h-[125px]">
            <p className="mb-[9px] font-['Space_Grotesk'] text-[10px] font-bold tracking-[.2em] text-[#ffba62]">Saisons</p>
            <div className="grid gap-2">
              {seasons.length === 0 ? (
                <div className="rounded-md border border-dashed border-[#333a4b] p-4 text-xs text-[#7d8497]">
                  Aucun episode indexe pour le moment.
                </div>
              ) : (
                seasons.map((season, index) => (
                  <button
                    key={season.name}
                    type="button"
                    onClick={() => setSelectedSeason(index)}
                    className={`mb-2 flex w-full cursor-pointer flex-col rounded-md border px-3.5 py-3 text-left ${index === selectedSeason ? "border-[#bd8645] bg-[#2a2118] text-white" : "border-[#252b3b] bg-[#141824] text-[#c4c8d2] hover:border-[#bd8645] hover:bg-[#2a2118]"} max-[700px]:inline-flex max-[700px]:w-auto max-[700px]:min-w-[125px] max-[700px]:mr-1`}
                  >
                    <span>{season.name}</span>
                    <small className="mt-1 text-[11px] text-[#747c8e]">
                      {season.episodes.length} episode{season.episodes.length > 1 ? "s" : ""}
                    </small>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="min-h-0 overflow-y-auto rounded-lg border border-[#252b3b] bg-[#111521] p-[18px] max-[700px]:p-[13px]">
            <div className="flex items-center justify-between gap-3.5">
              <div>
                <p className="mt-0 text-xs text-[#7d8497]">Sélection actuelle</p>
                <h3 className="m-0 mt-1 font-['Space_Grotesk'] text-[22px] font-semibold text-white max-[700px]:text-[19px]">{activeSeason?.name || "Aucune saison"}</h3>
              </div>
              <span className="rounded-full border border-[#343b4d] px-2.5 py-1 text-[11px] text-[#aab0bd]">
                {activeSeason?.episodes.length || 0} episode{(activeSeason?.episodes.length || 0) > 1 ? "s" : ""}
              </span>
            </div>

            <div className="mt-[18px] grid gap-2">
              {(activeSeason?.episodes || []).map((episode: EpisodeItem, index: number) => (
                <button
                  key={episode.path}
                  type="button"
                  onClick={() => onPlayEpisode?.(episode.path)}
                  className="flex cursor-pointer items-center justify-between rounded-md border border-[#252b3b] bg-[#141824] px-3.5 py-3 text-left text-[#c4c8d2] hover:border-[#bd8645] hover:bg-[#2a2118]"
                >
                  <div>
                    <p className="m-0 text-xs font-bold text-white">
                      Episode {index + 1}
                    </p>
                    <small className="mt-1 block max-w-[40vw] overflow-hidden text-ellipsis whitespace-nowrap text-[11px] text-[#747c8e]">{episode.name}</small>
                  </div>
                  <span className="text-[11px] font-bold text-[#ffba62]">Play</span>
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-2 border-t border-[#252b3b] pt-4 text-xs leading-[1.6] text-[#8990a1]">
              <p className="m-0"><strong className="mr-2 text-[#f2f0ec]">Synopsis</strong>{info_anime.synopsis || 'Aucune synopsis disponible.'}</p>
              <p className="m-0"><strong className="mr-2 text-[#f2f0ec]">Score</strong>{info_anime.score || 'Non classé'}</p>
              {info_anime.banner && <img className="mt-2 max-h-48 w-full rounded object-cover" src={info_anime.banner} alt="Affiche de la série" />}
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}