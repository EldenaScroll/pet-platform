import { useState } from 'react'
import { supabase } from './supabaseClient'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [role, setRole] = useState('owner')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()
        setLoading(true)

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: role,
                },
            },
        })

        setLoading(false)

        if (error) {
            alert(error.message)
        } else {
            console.log('Registered user:', data.user)
            alert('Registration Successful!')
            navigate('/dashboard')
        }
    }

    return (
        <div className="page-center">
            <div className="auth-card">
                <h2 className="auth-title">Create Account</h2>
                <form onSubmit={handleRegister} className="auth-form">
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="auth-input"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="auth-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="auth-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                    <select
                        className="auth-select"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="owner">Pet Owner</option>
                        <option value="sitter">Pet Sitter</option>
                    </select>
                    <button
                        type="submit"
                        disabled={loading}
                        className="auth-button"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                <p className="auth-footer">
                    Already have an account?{' '}
                    <Link to="/login" className="auth-link">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    )
}
