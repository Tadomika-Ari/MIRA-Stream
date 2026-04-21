import { useState, useRef } from 'react'
import './App.css'

function HttpRequest() {
  fetch('http://localhost:8000/')
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    })
    .then((data) => {
      console.log('JSON OK:', data)
    })
    .catch((err) => {
      console.error('Erreur requête:', err)
    })
}

function App() {
  const [count, setCount] = useState(0)

  const items = [
    { label: 'Ce connecter' },
    { label: 'Github' },
  ]

  const sectionRef = useRef(null)

  const handleScroll = () => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <a href="/" className="text-xl font-semibold tracking-wide text-white">
          MIRA Stream
        </a>

        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-5 text-sm">
            {items.map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={handleScroll}
                  className="text-zinc-200 transition hover:text-white"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-6xl flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">
            Bienvenue sur Mira Stream
          </h1>

          <button
            type="button"
            onClick={() => {
              setCount((v) => v + 1)
              HttpRequest()
            }}
            className="mt-6 rounded-md border border-zinc-600 bg-zinc-800 px-5 py-3 text-sm transition hover:bg-zinc-700"
          >
            Ce connecter au serveur
          </button>
        </section>

        <section ref={sectionRef} className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8">
          <p className="text-center text-zinc-300">
            Ton header est maintenant rendu par un composant React local, sans librairie externe.
          </p>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setCount((v) => v + 1)
                HttpRequest()
              }}
              className="rounded-md border border-zinc-600 bg-zinc-800 px-4 py-2 text-sm transition hover:bg-zinc-700"
            >
              Tester API ({count})
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
