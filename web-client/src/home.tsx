// @ts-nocheck
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { defaultApiBase, normalizeApiBase, setApiBase } from './lib/api'

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
    <div className="mira-page-in min-h-screen overflow-hidden bg-[#080a12] font-['DM_Sans'] text-[#f5f1eb] before:pointer-events-none before:fixed before:inset-0 before:bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] before:bg-[size:80px_80px] before:opacity-[.23]">
      <header className="relative z-[1] flex items-center justify-between px-[clamp(22px,6vw,90px)] py-7 max-[760px]:px-[18px] max-[760px]:py-[21px]">
        <button className="flex cursor-pointer items-center gap-[11px] border-0 bg-transparent text-white" type="button" onClick={() => navigate('/')}><span className="grid size-9 place-items-center rounded-[10px] bg-[#ffba62] font-['Space_Grotesk'] text-xl font-bold text-[#19130b]">M</span><strong className="flex flex-col items-start font-['Space_Grotesk'] text-[15px] font-bold tracking-[.12em]">MIRA<em className="mt-[3px] text-[9px] not-italic tracking-[.32em] text-[#ffba62]">STREAM</em></strong></button>
        <div className="text-[11px] text-[#777e90] max-[760px]:hidden"><i className="mr-[7px] inline-block size-1.5 rounded-full bg-[#81d79b] shadow-[0_0_10px_#81d79b]" /> Serveur privé · prêt à connecter</div>
      </header>
      <main className="relative z-[1] mx-auto max-w-[1250px] px-[clamp(22px,6vw,90px)] pb-[55px] pt-[clamp(35px,7vh,90px)] max-[760px]:px-[22px] max-[760px]:pb-[35px] max-[760px]:pt-[45px]">
        <section className="flex min-h-[490px] items-center justify-between gap-[50px] max-[760px]:block">
          <div className="max-w-[600px]">
            <p className="mb-5 font-['Space_Grotesk'] text-[10px] font-bold tracking-[.25em] text-[#ffba62]">VOTRE CINÉMA, PARTOUT</p>
            <h1 className="m-0 font-['Space_Grotesk'] text-[clamp(46px,6.8vw,88px)] font-bold leading-[.95] tracking-[-.06em] text-white max-[760px]:text-[51px]">Votre collection.<br /><strong className="text-[#ffba62]">Votre espace.</strong></h1>
            <p className="mt-7 max-w-[475px] text-base leading-[1.7] text-[#949aaa] max-[760px]:text-sm">MIRA Stream transforme votre serveur vidéo en une bibliothèque élégante, simple et accessible depuis tous vos écrans.</p>
            <div className="mt-[30px] flex flex-wrap gap-3">
              <button className="cursor-pointer rounded-[6px] border-0 bg-[#ffba62] px-[17px] py-[13px] text-[13px] font-bold text-[#21160a] hover:bg-[#ffd18e]" type="button" onClick={() => connectToServer(defaultApiBase)}><span className="mr-2">▶</span> Se connecter en local</button>
              <button className="cursor-pointer rounded-[6px] border border-[#383e50] bg-[#141824] px-[17px] py-[13px] text-[13px] font-bold text-[#e7e6e3] hover:border-[#ffba62]" type="button" onClick={() => { setCustomMode(!customMode); setAddressError('') }}><span className="mr-2">⌁</span> Adresse personnalisée</button>
            </div>
            {customMode && <form className="mt-5 w-full max-w-[440px] rounded-lg border border-[#2e3444] bg-[#111521] p-[17px]" onSubmit={(event) => { event.preventDefault(); connectToServer(serverAddress) }}><label className="mb-2 block text-xs font-bold text-[#e6e7ea]" htmlFor="server-address">Adresse du serveur</label><div className="flex"><input className="min-w-0 flex-1 rounded-l-[5px] border border-[#343b4d] bg-[#0a0d15] px-3 py-[11px] text-[13px] text-white outline-0 focus:border-[#ffba62]" id="server-address" value={serverAddress} onChange={(event) => setServerAddress(event.target.value)} placeholder="192.168.1.24:8000" autoFocus /><button className="w-[43px] rounded-r-[5px] border-0 bg-[#ffba62] text-[21px] text-[#20150a]" type="submit" aria-label="Se connecter à cette adresse">→</button></div><small className="mt-[9px] block text-[10px] text-[#737b8e]">Exemple : 192.168.1.24:8000 ou https://mon-serveur.local</small>{addressError && <p className="mt-2 text-[11px] text-[#ef9a88]">{addressError}</p>}</form>}
          </div>
          <div className="relative aspect-square w-[min(41vw,455px)] flex-none max-[760px]:mx-auto max-[760px]:mt-10 max-[760px]:w-[88vw] max-[760px]:max-w-[390px]" aria-hidden="true"><div className="absolute inset-[8%] rotate-[-18deg] skew-x-[-18deg] rounded-full border border-[rgba(255,186,98,.26)]" /><div className="absolute inset-[19%] rotate-[72deg] skew-x-[-22deg] rounded-full border border-[rgba(151,161,198,.24)]" /><div className="absolute inset-1/4 rounded-full bg-[radial-gradient(circle,rgba(255,186,98,.28),rgba(255,186,98,.04)_48%,transparent_70%)] blur-[7px]" /><div className="absolute inset-[37%] grid place-items-center rounded-full border border-[#ffba62] bg-[#121521] font-['Space_Grotesk'] text-[clamp(36px,6vw,65px)] font-bold text-[#ffba62] shadow-[0_0_50px_rgba(255,186,98,.25)]">M</div><div className="absolute right-0 top-[18%] flex flex-col rounded-[5px] border border-[#333a4b] bg-[#151925e8] px-[15px] py-3 shadow-[0_18px_40px_#0006]"><span className="font-['Space_Grotesk'] text-[9px] font-bold text-[#ffba62]">01</span><strong className="font-['Space_Grotesk'] text-[13px] tracking-[.11em] text-[#f6f3ed]">WATCH</strong><small className="text-[8px] tracking-[.16em] text-[#7f879a]">YOUR WAY</small></div><div className="absolute bottom-[19%] left-0 flex flex-col rounded-[5px] border border-[#333a4b] bg-[#151925e8] px-[15px] py-3 shadow-[0_18px_40px_#0006]"><span className="font-['Space_Grotesk'] text-[9px] font-bold text-[#ffba62]">●</span><strong className="font-['Space_Grotesk'] text-[13px] tracking-[.11em] text-[#f6f3ed]">LIBRARY</strong><small className="text-[8px] tracking-[.16em] text-[#7f879a]">ALWAYS READY</small></div></div>
        </section>
        <section className="grid grid-cols-3 border-y border-[#252a38] max-[760px]:block" aria-label="Fonctionnalités"><article className="border-r border-[#252a38] py-[25px] pr-6 max-[760px]:border-b max-[760px]:border-r-0 max-[760px]:py-[19px] max-[760px]:pr-0"><span className="font-['Space_Grotesk'] text-[10px] font-bold text-[#ffba62]">01</span><h2 className="my-[13px] mb-[7px] font-['Space_Grotesk'] text-[17px] font-semibold text-[#f2f0ec]">Une bibliothèque claire</h2><p className="text-xs leading-[1.6] text-[#777f92]">Retrouvez vos séries et épisodes sans vous perdre dans les menus.</p></article><article className="border-r border-[#252a38] px-6 py-[25px] max-[760px]:border-b max-[760px]:border-r-0 max-[760px]:px-0 max-[760px]:py-[19px]"><span className="font-['Space_Grotesk'] text-[10px] font-bold text-[#ffba62]">02</span><h2 className="my-[13px] mb-[7px] font-['Space_Grotesk'] text-[17px] font-semibold text-[#f2f0ec]">Votre serveur, vos règles</h2><p className="text-xs leading-[1.6] text-[#777f92]">Connectez votre installation locale ou une machine distante en quelques secondes.</p></article><article className="py-[25px] pl-6 max-[760px]:py-[19px] max-[760px]:pl-0"><span className="font-['Space_Grotesk'] text-[10px] font-bold text-[#ffba62]">03</span><h2 className="my-[13px] mb-[7px] font-['Space_Grotesk'] text-[17px] font-semibold text-[#f2f0ec]">Prêt pour le canapé</h2><p className="text-xs leading-[1.6] text-[#777f92]">Une interface pensée pour parcourir, choisir et lancer la lecture.</p></article></section>
      </main>
      <footer className="relative z-[1] flex justify-between px-[clamp(22px,6vw,90px)] pb-[25px] font-['Space_Grotesk'] text-[9px] tracking-[.16em] text-[#4f5667] max-[760px]:px-[22px] max-[760px]:pb-[18px] max-[760px]:text-[8px]"><span>MIRA STREAM / MEDIA CENTER</span><span>v0.1 · SELF-HOSTED</span></footer>
    </div>
  )
}

export default App
