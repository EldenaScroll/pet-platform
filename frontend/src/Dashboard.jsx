import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { useNavigate, Link } from 'react-router-dom'

export default function Dashboard() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                navigate('/login')
                return
            }
            setUser(user)
            setLoading(false)
        }
        getUser()
    }, [navigate])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/login')
    }

    if (loading) {
        return (
            <div className="page-center">
                <p>Loading...</p>
            </div>
        )
    }

    const fullName = user?.user_metadata?.full_name || 'User'
    const role = user?.user_metadata?.role || 'owner'
    const email = user?.email

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Welcome, {fullName}!</h1>
                    <p className="dashboard-subtitle">{email} · {role === 'sitter' ? '🐾 Pet Sitter' : '🏠 Pet Owner'}</p>
                </div>
                <button onClick={handleLogout} className="btn-logout">
                    Log Out
                </button>
            </div>

            <div className="dashboard-grid">
                <Link to="/search" className="dashboard-card">
                    <span className="dashboard-card-icon">🔍</span>
                    <h3>Find a Sitter</h3>
                    <p>Search for pet sitters near you</p>
                </Link>

                <Link to="/walk" className="dashboard-card">
                    <span className="dashboard-card-icon">🚶</span>
                    <h3>Active Walk</h3>
                    <p>Track your pet's current walk</p>
                </Link>

                <div className="dashboard-card">
                    <span className="dashboard-card-icon">📋</span>
                    <h3>My Bookings</h3>
                    <p>View your upcoming bookings</p>
                </div>

                <div className="dashboard-card">
                    <span className="dashboard-card-icon">🐶</span>
                    <h3>My Pets</h3>
                    <p>Manage your pet profiles</p>
                </div>
            </div>
        </div>
    )
}
