import React from "react"

type UserProfilDrawerProps = {
  open: boolean
  onClose: () => void
  name?: string
}

export default function UserProfilDrawer({ open, onClose, name = 'Mira Stream' }: UserProfilDrawerProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-6 font-['DM_Sans'] text-[#f6f3ed] max-[700px]:p-2.5">
      <button
        type="button"
        aria-label="Fermer les paramètres du profil"
        className="absolute inset-0 cursor-pointer border-0 bg-[rgba(3,5,10,.78)] backdrop-blur-[8px]"
        onClick={onClose}
      />
      <aside className="relative z-10 flex min-h-[430px] w-full max-w-[620px] flex-col overflow-hidden rounded-[10px] border border-[#2c3243] bg-[#0e111b] shadow-[0_24px_80px_#0009]">
        <div className="flex items-start justify-between gap-5 border-b border-[#252b3b] px-[30px] pb-5 pt-[26px] max-[700px]:px-[18px] max-[700px]:pb-[15px] max-[700px]:pt-5">
          <div>
            <p className="mb-[9px] font-['Space_Grotesk'] text-[10px] font-bold tracking-[.2em] text-[#ffba62]">PROFIL UTILISATEUR</p>
            <h2 className="m-0 font-['Space_Grotesk'] text-[30px] font-semibold text-white max-[700px]:text-2xl">Paramètres du profil</h2>
            <p className="mt-2 text-xs text-[#7d8497]">Gérez les informations de votre compte.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-[5px] border border-[#333a4b] bg-[#171b27] px-[13px] py-[9px] text-xs text-[#d7dae1] hover:border-[#ffba62] hover:text-[#ffba62]"
          >
            Fermer
          </button>
        </div>

        <div className="grid gap-6 px-[30px] pb-[30px] pt-[26px] max-[700px]:px-[18px]">
          <div className="flex items-center gap-4 rounded-[7px] border border-[#252b3b] bg-[#111521] p-4">
            <div className="grid size-16 place-items-center rounded-full border border-[#ffba62] bg-[#1d202d] font-['Space_Grotesk'] text-lg font-bold text-[#ffca85] shadow-[0_0_24px_rgba(255,186,98,.12)]">
              MS
            </div>
            <div>
              <p className="font-['Space_Grotesk'] text-base font-semibold text-white">{name}</p>
              <p className="mt-1 text-xs text-[#7d8497]">Profil actuellement connecté</p>
            </div>
          </div>

          <div className="grid gap-2">
            <button type="button" className="flex items-center justify-between rounded-[6px] border border-[#252b3b] bg-transparent px-4 py-3 text-left text-xs text-[#c8cbd3] hover:border-[#ffba62] hover:bg-[#171b27] hover:text-white">
              <span><strong className="block font-medium text-white">Nom du profil</strong><small className="mt-1 block text-[#777f92]">{name}</small></span>
              <span className="text-[#ffba62]" aria-hidden="true">›</span>
            </button>
            <button type="button" className="flex items-center justify-between rounded-[6px] border border-[#252b3b] bg-transparent px-4 py-3 text-left text-xs text-[#c8cbd3] hover:border-[#ffba62] hover:bg-[#171b27] hover:text-white">
              <span>
                <strong className="block font-medium text-white">Image du profil</strong>
                <small className="mt-1 block text-[#777f92]">Modifier votre avatar</small>
              </span>
              <span className="text-[#ffba62]" aria-hidden="true">›</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}