import React from "react";
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()
  const items = [
    { label: 'Acceuil', linkp: '/', type: 'internal' },
    { label: 'Github', linkp: 'https://github.com/Tadomika-Ari/MIRA-Stream', type: 'external' },
  ]
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
        <div className="min-h-screen bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container flex items-center justify-center p-6 overflow-hidden">
          hello word
        </div>
    </div>
  );
}