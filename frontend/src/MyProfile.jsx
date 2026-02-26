import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { useNavigate, Link } from 'react-router-dom'

export default function MyProfile() {
    const [profile, setProfile] = useState(null)
    const [fullName, setFullName] = useState('')
    const [zipCode, setZipCode] = useState('')
    const [bio, setBio] = useState('')
    const [role, setRole] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchProfile() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) { navigate('/login'); return }

            const res = await fetch('http://localhost:8081/api/profile', {
                headers: { Authorization: `Bearer ${session.access_token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setProfile(data)
                setFullName(data.fullName || '')
                setZipCode(data.zipCode || '')
                setBio(data.bio || '')
                setRole(data.role || 'owner')
            }
            setLoading(false)
        }
        fetchProfile()
    }, [navigate])

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)

        const { data: { session } } = await supabase.auth.getSession()
        const res = await fetch('http://localhost:8081/api/profile', {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${session.access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fullName, zipCode, bio })
        })

        if (res.ok) {
            alert('Profile updated!')
        } else {
            alert('Failed to update profile')
        }
        setSaving(false)
    }

    if (loading) return <div className="page-center"><p>Loading...</p></div>

    return (
        <div className="page-container">
            <div className="page-header">
                <Link to="/dashboard" className="back-link">← Dashboard</Link>
                <h1 className="page-title">My Profile</h1>
            </div>

            <div className="form-card">
                <form onSubmit={handleSave} className="profile-form">
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            className="form-input"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Your full name"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Zip Code</label>
                        <input
                            type="text"
                            className="form-input"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            placeholder="e.g. 10001"
                        />
                    </div>

                    {role === 'sitter' && (
                        <div className="form-group">
                            <label className="form-label">Bio / Description</label>
                            <textarea
                                className="form-textarea"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell pet owners about yourself..."
                                rows={4}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Role</label>
                        <p className="form-static">{role === 'sitter' ? '🐾 Pet Sitter' : '🏠 Pet Owner'}</p>
                    </div>

                    <button type="submit" disabled={saving} className="btn-primary">
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    )
}
