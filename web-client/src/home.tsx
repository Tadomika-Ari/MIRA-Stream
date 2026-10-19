// @ts-nocheck
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { defaultApiBase, normalizeApiBase, setApiBase } from './lib/api'
import './home.css'

function App() {
  const navigate = useNavigate()
  const [serverAddress, setServerAddress] = useState(localStorage.getItem('mira-stream-api-base') || '')
  const [customMode, setCustomMode] = useState(false)
  const [addressError, setAddressError] = useState('')

  const connectToServer = (address) => {
    if (!address.trim()) {
      setAddressError('Indiquez une adresse IP ou un nom d’hôte.')
      return
    }
    const normalized = normalizeApiBase(address)
    setApiBase(normalized)
    navigate('/conn')
  }

  return (
    <div className="home-shell">
      <header className="home-header">
        <button className="home-brand" type="button" onClick={() => navigate('/')}><span>M</span><strong>MIRA<em>STREAM</em></strong></button>
        <div className="home-status"><i /> Serveur privé · prêt à connecter</div>
      </header>
      <main className="home-main">
        <section className="home-hero">
          <div className="home-copy">
            <p className="home-kicker">VOTRE CINÉMA, PARTOUT</p>
            <h1>Votre collection.<br /><strong>Votre espace.</strong></h1>
            <p className="home-intro">MIRA Stream transforme votre serveur vidéo en une bibliothèque élégante, simple et accessible depuis tous vos écrans.</p>
            <div className="home-actions">
              <button className="home-primary" type="button" onClick={() => connectToServer(defaultApiBase)}><span>▶</span> Se connecter en local</button>
              <button className="home-secondary" type="button" onClick={() => { setCustomMode(!customMode); setAddressError('') }}><span>⌁</span> Adresse personnalisée</button>
            </div>
            {customMode && <form className="server-form" onSubmit={(event) => { event.preventDefault(); connectToServer(serverAddress) }}><label htmlFor="server-address">Adresse du serveur</label><div><input id="server-address" value={serverAddress} onChange={(event) => setServerAddress(event.target.value)} placeholder="192.168.1.24:8000" autoFocus /><button type="submit" aria-label="Se connecter à cette adresse">→</button></div><small>Exemple : 192.168.1.24:8000 ou https://mon-serveur.local</small>{addressError && <p>{addressError}</p>}</form>}
          </div>
          <div className="home-orbit" aria-hidden="true"><div className="orbit-ring orbit-ring-one" /><div className="orbit-ring orbit-ring-two" /><div className="orbit-glow" /><div className="orbit-card orbit-card-top"><span>01</span><strong>WATCH</strong><small>YOUR WAY</small></div><div className="orbit-card orbit-card-bottom"><span>●</span><strong>LIBRARY</strong><small>ALWAYS READY</small></div><div className="orbit-core">M</div></div>
        </section>
        <section className="home-features" aria-label="Fonctionnalités"><article><span>01</span><h2>Une bibliothèque claire</h2><p>Retrouvez vos séries et épisodes sans vous perdre dans les menus.</p></article><article><span>02</span><h2>Votre serveur, vos règles</h2><p>Connectez votre installation locale ou une machine distante en quelques secondes.</p></article><article><span>03</span><h2>Prêt pour le canapé</h2><p>Une interface pensée pour parcourir, choisir et lancer la lecture.</p></article></section>
      </main>
      <footer className="home-footer"><span>MIRA STREAM / MEDIA CENTER</span><span>v0.1 · SELF-HOSTED</span></footer>
    </div>
  )
}

export default App
