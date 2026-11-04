import { FormEvent, useState } from 'react'

type UserMenuProps = {
  name?: string
  image?: string
  onChangeUser: () => void
}

export default function AddUserMenu({}: UserMenuProps) {
  const [profileName, setProfileName] = useState('')

  const handleAction = (action: () => void) => {
    action()
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedName = profileName.trim()
    if (!trimmedName) return

    // Ajouter l'appel API avec trimmedName ici.
  }

  return (
    <div className="relative">
      <div className="absolute right-0 top-[46px] z-20 w-[254px] overflow-hidden rounded-[8px] border border-[#343b4d] bg-[#111521] shadow-[0_18px_45px_rgba(0,0,0,.45)]">
        <form className="grid gap-3 p-3" onSubmit={handleSubmit}>
          <div>
            <p className="text-xs font-medium text-white">Ajouter un profil</p>
          </div>
          <label htmlFor="profile-name" className="sr-only">Nom du profil</label>
          <input
            id="profile-name"
            type="text"
            value={profileName}
            onChange={(event) => setProfileName(event.target.value)}
            placeholder="Nom du profil"
            className="w-full rounded-[5px] border border-[#343b4d] bg-[#0e111b] px-3 py-[10px] text-xs text-white outline-none placeholder:text-[#687084] focus:border-[#ffba62]"
          />
          <button
            type="submit"
            disabled={!profileName.trim()}
            className="w-full cursor-pointer rounded-[5px] border-0 bg-[#ffba62] px-3 py-[10px] text-xs font-semibold text-[#19130b] hover:bg-[#ffca85] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Ajouter le profil
          </button>
        </form>
      </div>
    </div>
  )
}