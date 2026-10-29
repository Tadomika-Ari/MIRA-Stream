import { useEffect, useRef, useState } from 'react'
import UserProfilDrawer from './UserProfilDrawer'

type UserMenuProps = {
  name?: string
  image?: string
  onChangeUser: () => void
}

export default function UserMenu({
  name = 'Mira Stream',
  image = '',
  onChangeUser,
}: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const initials = name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false)
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [])

  const handleAction = (action: () => void) => {
    setOpen(false)
    action()
  }

  const openUserProfilDrawer = () => {
    setOpen(false)
    setProfileDrawerOpen(true)
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="size-[34px] flex-none cursor-pointer overflow-hidden rounded-full border border-[#495063] bg-[#1d202d] text-[11px] font-bold text-[#ffca85] transition hover:border-[#ffba62] hover:shadow-[0_0_0_4px_rgba(255,186,98,.1)]"
        type="button"
        title="Ouvrir le profil"
        aria-label={`Ouvrir le profil de ${name}`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {image ? <img className="size-full object-cover" src={image} alt="" /> : initials}
      </button>
      {open && (
        <div className="absolute right-0 top-[46px] z-20 w-[254px] overflow-hidden rounded-[8px] border border-[#343b4d] bg-[#111521] shadow-[0_18px_45px_rgba(0,0,0,.45)]">
          <div className="flex items-center gap-3 border-b border-[#252a39] px-4 py-[15px]">
            <div className="grid size-10 flex-none place-items-center overflow-hidden rounded-full border border-[#495063] bg-[#1d202d] font-['Space_Grotesk'] text-xs font-bold text-[#ffca85]">
              {image ? <img className="size-full object-cover" src={image} alt="" /> : initials}
            </div>
            <div className="min-w-0">
              <p className="truncate font-['Space_Grotesk'] text-sm font-semibold text-white">{name}</p>
              <p className="mt-1 text-[10px] tracking-[.08em] text-[#777f92]">PROFIL ACTIF</p>
            </div>
          </div>
          <div className="p-1.5">
            <button className="flex w-full cursor-pointer items-center gap-3 rounded-[5px] border-0 bg-transparent px-3 py-[11px] text-left text-xs text-[#c8cbd3] hover:bg-[#1d2230] hover:text-white" type="button" onClick={() => handleAction(onChangeUser)}>
              <span className="w-4 text-center text-base text-[#ffba62]" aria-hidden="true">⇄</span>
              Changer de compte
            </button>
            <button className="flex w-full cursor-pointer items-center gap-3 rounded-[5px] border-0 bg-transparent px-3 py-[11px] text-left text-xs text-[#c8cbd3] hover:bg-[#1d2230] hover:text-white" type="button" onClick={openUserProfilDrawer}>
              <span className="w-4 text-center text-base text-[#ffba62]" aria-hidden="true">⚙</span>
              Paramètres du compte
            </button>
          </div>
        </div>
      )}
      <UserProfilDrawer name={name} open={profileDrawerOpen} onClose={() => setProfileDrawerOpen(false)} />
    </div>
  )
}