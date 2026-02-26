import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import Dashboard from './Dashboard'
import Search from './Search'
import ActiveWalk from './ActiveWalk'
import Success from './Success'
import MyProfile from './MyProfile'
import MyPets from './MyPets'
import MyBookings from './MyBookings'
import SitterRequests from './SitterRequests'


function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Temp</h1>
      <div className="home-buttons">
        <Link to="/login" className="btn-login">
          Login
        </Link>
        <Link to="/register" className="btn-register">
          Register
        </Link>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/search" element={<Search />} />
        <Route path="/walk" element={<ActiveWalk />} />
        <Route path="/success" element={<Success />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/my-pets" element={<MyPets />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/sitter-requests" element={<SitterRequests />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
