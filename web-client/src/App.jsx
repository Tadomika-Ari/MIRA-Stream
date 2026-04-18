import { useState } from 'react'
import './App.css'

function HttpRequest() {
  fetch("http://localhost:8000/")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    })
    .then((data) => {
      console.log("JSON OK:", data)
    })
    .catch((err) => {
      console.error("Erreur requête:", err)
    })
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <section>
      <button onClick={() => setCount((prev) => prev + 1)}>
        this is a test ({count})
      </button>
      <button onClick={HttpRequest} className="flex justify-center">
        request test
      </button>
      <div className="min-h-screen flex items-center justify-center text-4xl">
        Hello Word
      </div>
    </section>
  )
}

export default App
