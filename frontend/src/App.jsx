import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { apiService } from './services/api'

function App() {
  const [count, setCount] = useState(0)
  const [apiStatus, setApiStatus] = useState('Vérification...')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  // Test de connexion à l'API au chargement
  useEffect(() => {
    testApiConnection()
  }, [])

  const testApiConnection = async () => {
    try {
      const response = await apiService.testConnection()
      setApiStatus(`✅ ${response.message}`)
    } catch (error) {
      setApiStatus(`❌ ${error.message}`)
    }
  }

  const loadUsers = async () => {
    setLoading(true)
    try {
      const response = await apiService.getData()
      setUsers(response.users)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Application Wacdo</h1>
      <h2>Frontend React + Backend Laravel</h2>
      
      <div className="card">
        <div style={{ marginBottom: '20px' }}>
          <h3>État de l'API Laravel:</h3>
          <p>{apiStatus}</p>
        </div>
        
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        
        <div style={{ margin: '20px 0' }}>
          <button onClick={loadUsers} disabled={loading}>
            {loading ? 'Chargement...' : 'Charger les utilisateurs de test'}
          </button>
        </div>
        
        {users.length > 0 && (
          <div style={{ textAlign: 'left', marginTop: '20px' }}>
            <h3>Utilisateurs récupérés depuis l'API Laravel:</h3>
            <ul>
              {users.map(user => (
                <li key={user.id}>
                  <strong>{user.name}</strong> - {user.email}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <p className="read-the-docs">
        L'API Laravel tourne sur localhost:8000<br/>
        Le frontend React tourne sur localhost:5173
      </p>
    </>
  )
}

export default App
