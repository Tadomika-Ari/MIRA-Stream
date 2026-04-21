import React from "react";

export default function LoginPage() {
    const goHome = () => {
    window.location.hash = '#home'
  }
  return (
    <div>
        <button
          type="button"
          onClick={goHome}
          className="fixed left-4 top-4 z-20 rounded-md border border-zinc-600 bg-zinc-900/90 px-4 py-2 text-sm text-zinc-100 backdrop-blur transition hover:bg-zinc-800"
        >
          Retour à l’accueil
        </button>
    <div className="min-h-screen bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container flex items-center justify-center p-6 overflow-hidden">
        hello word
    </div>
    </div>
  );
}