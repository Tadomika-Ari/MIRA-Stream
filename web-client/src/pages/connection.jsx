import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import homelogo from '../assets/maisonclair.png'
import cameralogo from '../assets/filmclair.png'

const folderIcon = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-12 w-12 text-amber-300">
    <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h4l2 2h7A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9Z" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const fileIcon = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-12 w-12 text-sky-300">
    <path d="M7 3.75h7l4 4v12.5A1.75 1.75 0 0 1 16.25 22h-9.5A1.75 1.75 0 0 1 5 20.25V5.5A1.75 1.75 0 0 1 6.75 3.75Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M14 3.75V8h4" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

export default function LoginPage() {

  const [explorerItems, setExplorerItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const navigate = useNavigate()

  const items = [
    { label: 'Acceuil', linkp: '/', type: 'internal' },
    { label: 'Github', linkp: 'https://github.com/Tadomika-Ari/MIRA-Stream', type: 'external' },
  ]

  const loadExplorerItems = async () => {
    try {
      setLoading(true)
      setError('')

      const res = await fetch('http://localhost:8000/')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()
      setExplorerItems(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Erreur requête:', err)
      setExplorerItems([])
      setError("Impossible de charger le dossier.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadExplorerItems()
  }, [])

  const renderIcon = (type) => (type === 'dir' ? folderIcon : fileIcon)

  return (
    <div>
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <a href="/" className="text-xl font-semibold tracking-wide text-white">
          MIRA Stream
        </a>

        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-5 text-sm">
            {items.map((item) => (
              <li key={item.label}>
                {item.type === 'external' ? (
                  <a
                    href={item.linkp}
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-200 transition hover:text-white"
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate(item.linkp)}
                    className="text-zinc-200 transition hover:text-white"
                  >
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <section className="verticale-lr mx-4">
        <img src={homelogo} alt="Logo accueil" onClick={() => navigate('/')} className="h-15 w-15 object-contain mx-2" />
        <img src={cameralogo} alt="Logo Film" className="h-15 w-15 object-contain mx-2"/>
      </section>
      <main className="">
        <section className="mx-auto w-full h-full max-w-6xl px-4 pb-20">
          <div className="mx-auto w-full h-full max-w-6xl rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
            <p className="mb-3 text-sm font-semibold text-zinc-100">Explorateur</p>

            {loading ? (
              <p className="py-10 text-center text-sm text-zinc-300">Chargement du dossier...</p>
            ) : error ? (
              <p className="py-10 text-center text-sm text-zinc-300">{error}</p>
            ) : (
              <ul className="grid grid-cols-2 gap-3 text-sm text-zinc-200 sm:grid-cols-3">
                {explorerItems.map((item) => (
                  <li
                    key={item.name}
                    className="flex min-h-28 flex-col items-center justify-center rounded-lg border border-white/10 bg-white/5 p-3 text-center transition hover:bg-white/10"
                  >
                    {renderIcon(item.type)}
                    <span className="mt-2 text-xs">{item.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}