import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Login from './Login'

// placeholder for dashboard
function Dashboard() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
      <p>You are logged in.</p>
    </div>
  )
}

function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-4xl font-bold text-blue-600">Temp</h1>
      <Link to="/login" className="bg-blue-500 text-white px-6 py-2 rounded">
        Login
      </Link>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
