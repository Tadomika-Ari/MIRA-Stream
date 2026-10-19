// @ts-nocheck
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BiblioDrawer from '../components/BiblioDrawer'
import { getApiBase } from '../lib/api'
import './connection.css'

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
        const response = await fetch(`${getApiBase()}/jikan/${encodeURIComponent(name)}`)
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
    <div className="library-shell">
      <aside className="library-sidebar">
        <button className="brand-lockup" onClick={() => navigate('/')} type="button"><span className="brand-mark">M</span><span>MIRA<span>STREAM</span></span></button>
        <nav aria-label="Navigation principale" className="sidebar-nav">
          <button className="nav-item active" type="button"><span>⌂</span> Accueil</button>
          <button className="nav-item" type="button" onClick={() => document.getElementById('library')?.scrollIntoView({ behavior: 'smooth' })}><span>▦</span> Ma bibliothèque</button>
          <a className="nav-item" href="https://github.com/Tadomika-Ari/MIRA-Stream" target="_blank" rel="noreferrer"><span>◌</span> Projet GitHub</a>
        </nav>
        <div className="sidebar-foot">MIRA STREAM <span>LOCAL SERVER</span></div>
      </aside>
      <main className="library-main">
        <header className="library-header"><div className="mobile-brand">MIRA<span>STREAM</span></div><label className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher dans votre bibliothèque" aria-label="Rechercher" />{query && <button type="button" onClick={() => setQuery('')} aria-label="Effacer la recherche">×</button>}</label><button className="profile-button" type="button" title="Profil">MS</button></header>
        {loading ? <div className="library-loading"><span /> Chargement de votre bibliothèque...</div> : error ? <div className="library-error">{error}<button type="button" onClick={loadBiblio}>Réessayer</button></div> : <>
          {featured && <section className="featured-hero" style={featuredImage ? { backgroundImage: `linear-gradient(90deg, #080a12 8%, rgba(8,10,18,.75) 42%, rgba(8,10,18,.1)), url(${featuredImage})` } : {}}><div className="hero-copy"><p className="eyebrow">À LA UNE · VOTRE SERVEUR</p><h1>{featured.name}</h1><p className="hero-meta">Série · {featured.totalseason || 0} saison{featured.totalseason > 1 ? 's' : ''} · {featured.nbseason || 0} épisodes</p><p className="hero-description">Retrouvez votre collection, saison après saison, dans une expérience pensée pour le grand écran.</p><button className="primary-action" type="button" onClick={() => setSelectedBiblio(featured)}><span>▶</span> Ouvrir la fiche</button></div></section>}
          <section className="library-section" id="library"><div className="section-heading"><div><p className="eyebrow">COLLECTION LOCALE</p><h2>Votre bibliothèque</h2></div><span className="library-count">{filteredItems.length} titre{filteredItems.length > 1 ? 's' : ''}</span></div><div className="filter-row" role="tablist" aria-label="Filtrer la bibliothèque">{[['all', 'Tout voir'], ['complete', 'Séries suivies'], ['new', 'Ajouts récents']].map(([value, label]) => <button key={value} className={filter === value ? 'filter-button selected' : 'filter-button'} onClick={() => setFilter(value)} type="button" role="tab" aria-selected={filter === value}>{label}</button>)}</div>{filteredItems.length === 0 ? <div className="empty-state">Aucun titre ne correspond à votre recherche.</div> : <div className="poster-grid">{filteredItems.map((item) => <button className="poster-card" onClick={() => setSelectedBiblio(item)} key={item.name} type="button"><div className="poster-art" style={biblioInfos[item.name] ? { backgroundImage: `linear-gradient(0deg, rgba(5,7,12,.92), transparent 60%), url(${biblioInfos[item.name]})` } : {}}><span className="poster-fallback">{item.name?.charAt(0)}</span><span className="poster-play">▶</span></div><div className="poster-info"><strong>{item.name}</strong><span>{item.totalseason || 0} saison{item.totalseason > 1 ? 's' : ''} · {item.nbseason || 0} épisodes</span></div></button>)}</div>}</section>
        </>}
      </main>
      <BiblioDrawer biblio={selectedBiblio} open={Boolean(selectedBiblio)} onClose={() => setSelectedBiblio(null)} onPlayEpisode={(episodePath) => navigate(`/player/${encodeURIComponent(episodePath)}`)} />
    </div>
  )
}
