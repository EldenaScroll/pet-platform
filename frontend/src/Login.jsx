import { useState } from 'react'
import { supabase } from './supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    
    // call supabase auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      // sucessful login
      console.log("Logged in user:", data.user)
      alert("Login Successful!")
      navigate('/dashboard') // go to dashboard after login
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-96 bg-white p-8 rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Pet Sitter Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-bold">
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}