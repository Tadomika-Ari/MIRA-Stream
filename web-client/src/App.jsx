import { useState } from 'react'
import './App.css'

function HttpRequest() {
  const localhost = "test"
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <section>
      <button onClick={() => setCount((prev) => prev + 1)}>
        this is a test ({count})
      </button>
      <button onClick={HttpRequest()} class="flex justify-center">
        request test
      </button>
      <div class="min-h-screen flex items-center justify-center text-4xl">
        Hello Word
      </div>
    </section>
  )
}

export default App
