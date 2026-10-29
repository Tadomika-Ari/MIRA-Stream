export type UserProfile = {
  id: string
  name: string
  initials: string
  accent: string
  description: string
}

type UserSelectionProps = {
  profiles?: UserProfile[]
  onSelect: (profile: UserProfile) => void
}

const defaultProfiles: UserProfile[] = [
  { id: 'mira', name: 'Mira', initials: 'M', accent: 'from-[#ffcf83] via-[#d8794d] to-[#542e46]', description: 'Bibliothèque principale' },
  { id: 'alex', name: 'Alex', initials: 'A', accent: 'from-[#87b9bd] via-[#416b85] to-[#202b4d]', description: 'Profil personnel' },
  { id: 'sofia', name: 'Sofia', initials: 'S', accent: 'from-[#dca4bb] via-[#8e577e] to-[#382942]', description: 'Profil personnel' },
  { id: 'kids', name: 'Kids', initials: 'K', accent: 'from-[#f2c56f] via-[#d07a54] to-[#633c38]', description: 'Profil enfant' },
]

export default function UserSelection({ profiles = defaultProfiles, onSelect }: UserSelectionProps) {
  return (
    <main className="mira-page-in relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080a12] px-5 py-12 font-['DM_Sans'] text-[#f6f3ed] before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_18%,rgba(255,186,98,.1),transparent_32%),linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] before:bg-[size:auto,80px_80px,80px_80px]">
      <section className="relative z-[1] w-full max-w-[930px] text-center">
        <div className="mira-fade-up mb-12">
          <div className="mx-auto mb-7 grid size-11 place-items-center rounded-[12px] bg-[#ffba62] font-['Space_Grotesk'] text-2xl font-bold text-[#19130b] shadow-[0_8px_30px_rgba(255,186,98,.18)]">M</div>
          <p className="mb-3 font-['Space_Grotesk'] text-[10px] font-bold tracking-[.28em] text-[#ffba62]">MIRA STREAM</p>
          <h1 className="font-['Space_Grotesk'] text-[clamp(30px,5vw,52px)] font-semibold tracking-[-.04em] text-white">Qui regarde ce soir ?</h1>
          <p className="mt-3 text-sm text-[#7d8497]">Choisissez votre profil pour continuer.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-x-7 gap-y-9">
          {profiles.map((profile, index) => (
            <button
              key={profile.id}
              type="button"
              onClick={() => onSelect(profile)}
              className="mira-fade-up group flex w-[150px] cursor-pointer flex-col items-center border-0 bg-transparent text-center"
              style={{ animationDelay: `${140 + index * 75}ms` }}
            >
              <span className={`grid size-[142px] place-items-center rounded-[9px] bg-gradient-to-br ${profile.accent} font-['Space_Grotesk'] text-[58px] font-semibold text-white shadow-[0_14px_30px_rgba(0,0,0,.3)] ring-1 ring-white/10 transition duration-200 group-hover:-translate-y-1 group-hover:scale-[1.03] group-hover:ring-2 group-hover:ring-[#ffba62]`}>
                {profile.initials}
              </span>
              <strong className="mt-4 font-['Space_Grotesk'] text-[15px] font-medium text-[#dfe0e4] transition group-hover:text-[#ffba62]">{profile.name}</strong>
              <span className="mt-1 text-[10px] text-[#6f778a]">{profile.description}</span>
            </button>
          ))}
          <button type="button" className="mira-fade-up group flex w-[150px] cursor-pointer flex-col items-center border-0 bg-transparent text-center" style={{ animationDelay: `${140 + profiles.length * 75}ms` }} onClick={() => {}}>
            <span className="grid size-[142px] place-items-center rounded-[9px] border border-dashed border-[#3b4254] bg-[#111521] text-[42px] font-light text-[#7b8395] transition group-hover:border-[#ffba62] group-hover:text-[#ffba62]">+</span>
            <strong className="mt-4 font-['Space_Grotesk'] text-[15px] font-medium text-[#9399a8] transition group-hover:text-[#ffba62]">Ajouter un profil</strong>
            <span className="mt-1 text-[10px] text-[#5f677a]">Bientôt disponible</span>
          </button>
        </div>

        <p className="mt-16 font-['Space_Grotesk'] text-[9px] tracking-[.2em] text-[#424958]">VOTRE SERVEUR · VOS PROFILS</p>
      </section>
    </main>
  )
}