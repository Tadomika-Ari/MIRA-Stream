import { FormEvent, useState } from 'react'
import { getApiBase } from '../lib/api'

type UserMenuProps = {
  name?: string
  image?: string
  onChangeUser: () => void
  onUserAdded: () => void
}

async function addUser(name: string): Promise<string[]> {
  try {
    const res = await fetch(`${getApiBase()}/api/user/add/${encodeURIComponent(name)}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    return data?.all_user ?? []
  } catch (err) {
    console.error('Erreur requête:', err)
    return []
  }
}

export default function AddUserMenu({ onChangeUser, onUserAdded }: UserMenuProps) {
  const [profileName, setProfileName] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedName = profileName.trim()
    if (!trimmedName) return
    const users = await addUser(trimmedName)
    if (users.length > 0) onUserAdded()
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Fermer"
        className="fixed inset-0 z-10 cursor-default border-0 bg-black/35 p-0 backdrop-blur-[3px]"
        onClick={onChangeUser}
      />
      <div className="fixed left-1/2 top-1/2 z-20 w-[254px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[8px] border border-[#343b4d] bg-[#111521] shadow-[0_18px_45px_rgba(0,0,0,.45)]">
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