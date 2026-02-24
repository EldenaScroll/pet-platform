import { useState } from 'react'
import { supabase } from './supabaseClient'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      console.log("Logged in user:", data.user)
      alert("Login Successful!")
      navigate('/dashboard')
    }
  }

  return (
    <div className="page-center">
      <div className="auth-card">
        <h2 className="auth-title">Pet Sitter Login</h2>
        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            className="auth-input"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="auth-button">
            Sign In
          </button>
        </form>
        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}