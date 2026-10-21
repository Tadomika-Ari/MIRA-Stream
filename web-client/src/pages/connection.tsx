// @ts-nocheck
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BiblioDrawer from '../components/BiblioDrawer'
import { getApiBase } from '../lib/api'

export default function LoginPage() {
  const [biblioItems, setBiblioItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedBiblio, setSelectedBiblio] = useState(null)
  const [biblioInfos, setBiblioInfos] = useState({})
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()

  const loadBiblio = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch(`${getApiBase()}/biblio`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      setBiblioItems(Array.isArray(data) ? data : [])
    } catch (requestError) {
      console.error('Erreur requête:', requestError)
      setBiblioItems([])
      setError('Impossible de charger la bibliothèque.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadBiblio() }, [])

  useEffect(() => {
    biblioItems.forEach(async (item) => {
      try {
        const name = item.name ?? ''
        const response = await fetch(`${getApiBase()}/anilist/${encodeURIComponent(name)}`)
        if (!response.ok) return
        const data = await response.json()
        const imageUrl = data?.data?.[0]?.images?.webp?.image_url
        if (imageUrl) setBiblioInfos((previous) => ({ ...previous, [name]: imageUrl }))
      } catch (requestError) {
        console.error(`Jikan fetch failed for ${item.name}:`, requestError)
      }
    })
  }, [biblioItems])

  const filteredItems = useMemo(() => biblioItems.filter((item) => {
    const matchesQuery = (item.name ?? '').toLowerCase().includes(query.toLowerCase())
    if (filter === 'complete') return matchesQuery && (item.nbseason ?? 0) > 0
    if (filter === 'new') return matchesQuery && biblioItems.indexOf(item) < 4
    return matchesQuery
  }), [biblioItems, filter, query])

  const featured = biblioItems[0]
  const featuredImage = featured && biblioInfos[featured.name]

  return (
    <div className="flex min-h-screen bg-[#080a12] font-['DM_Sans'] text-[#f6f3ed]">
      <aside className="flex w-[238px] flex-none flex-col border-r border-white/[.07] bg-[#0c0e17] px-[18px] pb-6 pt-[30px] max-[700px]:hidden">
        <button className="flex cursor-pointer items-center gap-2.5 border-0 bg-transparent text-left font-['Space_Grotesk'] text-[15px] font-bold tracking-[.1em] text-white" onClick={() => navigate('/')} type="button"><span className="grid size-[34px] place-items-center rounded-[10px] bg-[#ffb85c] font-['Space_Grotesk'] text-[19px] font-bold text-[#13100d] shadow-[0_7px_24px_rgba(255,184,92,.2)]">M</span><span className="flex flex-col leading-[1.1]">MIRA<span className="mt-1 text-[9px] tracking-[.3em] text-[#ffba62]">STREAM</span></span></button>
        <nav aria-label="Navigation principale" className="mt-[68px] grid gap-1.5">
          <button className="group flex cursor-pointer items-center gap-3.5 rounded-lg border-0 bg-[#191c29] px-[13px] py-3 text-left text-[13px] font-medium text-white" type="button"><span className="w-[18px] text-center text-lg text-[#ffb85c]">⌂</span> Accueil</button>
          <button className="group flex cursor-pointer items-center gap-3.5 rounded-lg border-0 bg-transparent px-[13px] py-3 text-left text-[13px] font-medium text-[#8c91a3] hover:bg-[#191c29] hover:text-white" type="button" onClick={() => document.getElementById('library')?.scrollIntoView({ behavior: 'smooth' })}><span className="w-[18px] text-center text-lg text-[#777d91]">▦</span> Ma bibliothèque</button>
          <a className="flex items-center gap-3.5 rounded-lg px-[13px] py-3 text-[13px] font-medium text-[#8c91a3] no-underline hover:bg-[#191c29] hover:text-white" href="https://github.com/Tadomika-Ari/MIRA-Stream" target="_blank" rel="noreferrer"><span className="w-[18px] text-center text-lg text-[#777d91]">◌</span> Projet GitHub</a>
        </nav>
        <div className="mt-auto text-[9px] leading-[1.8] tracking-[.2em] text-[#424756]">MIRA STREAM <span className="block text-[8px] text-[#696e7c]">LOCAL SERVER</span></div>
      </aside>
      <main className="min-w-0 flex-1 bg-[radial-gradient(circle_at_76%_0%,rgba(72,75,113,.18),transparent_30%),#080a12]">
        <header className="flex h-[86px] items-center justify-end gap-[18px] border-b border-white/[.05] px-[clamp(22px,5vw,70px)] max-[700px]:h-[72px] max-[700px]:justify-between max-[700px]:px-[18px]"><div className="hidden flex-col font-['Space_Grotesk'] text-[13px] font-bold leading-[1.1] tracking-[.1em] text-white max-[700px]:flex">MIRA<span className="mt-1 text-[8px] tracking-[.3em] text-[#ffba62]">STREAM</span></div><label className="flex h-[38px] w-[min(380px,55vw)] items-center gap-2.5 rounded-[7px] border border-[#252a39] bg-[#111521] px-[13px] text-[#777d90] max-[700px]:max-w-[250px] max-[700px]:flex-1"><span>⌕</span><input className="min-w-0 flex-1 border-0 bg-transparent text-[13px] text-[#eee] outline-0" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher dans votre bibliothèque" aria-label="Rechercher" />{query && <button className="border-0 bg-transparent text-xl text-[#9da2b1]" type="button" onClick={() => setQuery('')} aria-label="Effacer la recherche">×</button>}</label><button className="size-[34px] flex-none rounded-full border border-[#495063] bg-[#1d202d] text-[11px] font-bold text-[#ffca85]" type="button" title="Profil">MS</button></header>
        {loading ? <div className="my-[130px] text-center text-sm text-[#8990a1]"><span className="mr-2 inline-block size-2 rounded-full bg-[#ffb85c]" /> Chargement de votre bibliothèque...</div> : error ? <div className="my-[130px] text-center text-sm text-[#8990a1]">{error}<button className="ml-3 rounded border border-[#495063] px-3 py-1" type="button" onClick={loadBiblio}>Réessayer</button></div> : <>
          {featured && <section className="relative mx-[clamp(22px,5vw,70px)] flex min-h-[438px] items-center border-b border-white/[.06] bg-[#111521] bg-cover bg-right bg-no-repeat max-[700px]:mx-0 max-[700px]:min-h-[390px] max-[700px]:bg-cover max-[700px]:bg-center max-[700px]:px-[22px]" style={featuredImage ? { backgroundImage: `linear-gradient(90deg, #080a12 8%, rgba(8,10,18,.75) 42%, rgba(8,10,18,.1)), url(${featuredImage})` } : {}}><div className="max-w-[470px] py-[62px] max-[700px]:relative max-[700px]:z-[1] max-[700px]:py-[35px]"><p className="mb-3.5 font-['Space_Grotesk'] text-[10px] font-bold tracking-[.2em] text-[#ffb85c]">À LA UNE · VOTRE SERVEUR</p><h1 className="m-0 max-w-[500px] font-['Space_Grotesk'] text-[clamp(38px,5vw,66px)] font-bold leading-[.98] tracking-[-.03em] text-white max-[700px]:text-[42px]">{featured.name}</h1><p className="mt-[22px] text-sm text-[#c3c6d0]">Série · {featured.totalseason || 0} saison{featured.totalseason > 1 ? 's' : ''} · {featured.nbseason || 0} épisodes</p><p className="max-w-[365px] text-[13px] leading-[1.7] text-[#878d9f]">Retrouvez votre collection, saison après saison, dans une expérience pensée pour le grand écran.</p><button className="mt-[13px] rounded-[6px] border-0 bg-[#ffb85c] px-[17px] py-3 font-bold text-[#1b1208] hover:bg-[#ffd18e]" type="button" onClick={() => setSelectedBiblio(featured)}><span className="mr-2">▶</span> Ouvrir la fiche</button></div></section>}
          <section className="px-[clamp(22px,5vw,70px)] pb-[70px] pt-[46px] max-[700px]:px-[18px] max-[700px]:pb-[50px] max-[700px]:pt-[35px]" id="library"><div className="flex items-end justify-between"><div><p className="mb-3.5 font-['Space_Grotesk'] text-[10px] font-bold tracking-[.2em] text-[#ffb85c]">COLLECTION LOCALE</p><h2 className="m-0 font-['Space_Grotesk'] text-[27px] font-semibold text-white max-[700px]:text-[23px]">Votre bibliothèque</h2></div><span className="text-xs text-[#73798b]">{filteredItems.length} titre{filteredItems.length > 1 ? 's' : ''}</span></div><div className="my-[25px] flex gap-[22px] overflow-x-auto whitespace-nowrap border-b border-[#202433]" role="tablist" aria-label="Filtrer la bibliothèque">{[['all', 'Tout voir'], ['complete', 'Séries suivies'], ['new', 'Ajouts récents']].map(([value, label]) => <button key={value} className={filter === value ? 'border-0 border-b-2 border-[#ffb85c] bg-transparent px-0 pb-[11px] text-xs text-white' : 'border-0 border-b-2 border-transparent bg-transparent px-0 pb-[11px] text-xs text-[#777d8e]'} onClick={() => setFilter(value)} type="button" role="tab" aria-selected={filter === value}>{label}</button>)}</div>{filteredItems.length === 0 ? <div className="my-[130px] text-center text-sm text-[#8990a1]">Aucun titre ne correspond à votre recherche.</div> : <div className="grid grid-cols-[repeat(auto-fill,minmax(155px,1fr))] gap-x-4 gap-y-6 max-[700px]:grid-cols-2 max-[700px]:gap-x-[13px]">{filteredItems.map((item) => <button className="cursor-pointer border-0 bg-transparent p-0 text-left text-white" onClick={() => setSelectedBiblio(item)} key={item.name} type="button"><div className="group relative grid aspect-[2/3] place-items-center overflow-hidden rounded-[6px] bg-[linear-gradient(145deg,#262b3b,#111521)] bg-cover bg-center transition duration-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,.35)]" style={biblioInfos[item.name] ? { backgroundImage: `linear-gradient(0deg, rgba(5,7,12,.92), transparent 60%), url(${biblioInfos[item.name]})` } : {}}><span className="font-['Space_Grotesk'] text-[64px] font-bold text-white/25">{item.name?.charAt(0)}</span><span className="absolute bottom-2.5 right-2.5 grid size-[29px] place-items-center rounded-full bg-[#ffbd68] text-[11px] text-[#16120d] opacity-0 transition group-hover:opacity-100">▶</span></div><div className="pt-2.5"><strong className="block overflow-hidden text-[13px] text-[#f4f2ef] text-ellipsis whitespace-nowrap">{item.name}</strong><span className="text-[11px] text-[#777d8e]">{item.totalseason || 0} saison{item.totalseason > 1 ? 's' : ''} · {item.nbseason || 0} épisodes</span></div></button>)}</div>}</section>
        </>}
      </main>
      <BiblioDrawer biblio={selectedBiblio} open={Boolean(selectedBiblio)} onClose={() => setSelectedBiblio(null)} onPlayEpisode={(episodePath) => navigate(`/player/${encodeURIComponent(episodePath)}`)} />
    </div>
  )
}
