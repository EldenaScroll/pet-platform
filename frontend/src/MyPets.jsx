import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { Link, useNavigate } from 'react-router-dom'

export default function MyPets() {
    const [pets, setPets] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingPet, setEditingPet] = useState(null)
    const [name, setName] = useState('')
    const [breed, setBreed] = useState('')
    const [age, setAge] = useState('')
    const navigate = useNavigate()

    const getToken = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { navigate('/login'); return null }
        return session.access_token
    }

    const fetchPets = async () => {
        const token = await getToken()
        if (!token) return
        const res = await fetch('http://localhost:8081/api/pets', {
            headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
            setPets(await res.json())
        }
        setLoading(false)
    }

    useEffect(() => { fetchPets() }, [])

    const resetForm = () => {
        setName('')
        setBreed('')
        setAge('')
        setEditingPet(null)
        setShowForm(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const token = await getToken()
        if (!token) return

        const payload = { name, breed, age: age ? parseInt(age) : null }

        if (editingPet) {
            // Update
            await fetch(`http://localhost:8081/api/pets/${editingPet.id}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
        } else {
            // Create
            await fetch('http://localhost:8081/api/pets', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
        }

        resetForm()
        fetchPets()
    }

    const handleEdit = (pet) => {
        setEditingPet(pet)
        setName(pet.name)
        setBreed(pet.breed || '')
        setAge(pet.age ? String(pet.age) : '')
        setShowForm(true)
    }

    const handleDelete = async (petId) => {
        if (!window.confirm('Delete this pet?')) return
        const token = await getToken()
        if (!token) return

        await fetch(`http://localhost:8081/api/pets/${petId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        })
        fetchPets()
    }

    if (loading) return <div className="page-center"><p>Loading...</p></div>

    return (
        <div className="page-container">
            <div className="page-header">
                <Link to="/dashboard" className="back-link">← Dashboard</Link>
                <h1 className="page-title">My Pets</h1>
                {!showForm && (
                    <button onClick={() => setShowForm(true)} className="btn-primary">
                        + Add Pet
                    </button>
                )}
            </div>

            {showForm && (
                <div className="form-card">
                    <h3 className="form-card-title">{editingPet ? 'Edit Pet' : 'Add New Pet'}</h3>
                    <form onSubmit={handleSubmit} className="pet-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Name *</label>
                                <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Breed</label>
                                <input type="text" className="form-input" value={breed} onChange={e => setBreed(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Age</label>
                                <input type="number" className="form-input" value={age} onChange={e => setAge(e.target.value)} min="0" max="30" />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
                            <button type="submit" className="btn-primary">{editingPet ? 'Save' : 'Add Pet'}</button>
                        </div>
                    </form>
                </div>
            )}

            {pets.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">🐶</span>
                    <p>No pets yet. Add your first pet!</p>
                </div>
            ) : (
                <div className="pets-grid">
                    {pets.map(pet => (
                        <div key={pet.id} className="pet-card">
                            <div className="pet-card-avatar">🐕</div>
                            <div className="pet-card-info">
                                <h3>{pet.name}</h3>
                                <p>{pet.breed || 'Unknown breed'} {pet.age ? `· ${pet.age} yrs` : ''}</p>
                            </div>
                            <div className="pet-card-actions">
                                <button onClick={() => handleEdit(pet)} className="btn-icon" title="Edit">✏️</button>
                                <button onClick={() => handleDelete(pet.id)} className="btn-icon btn-icon-danger" title="Delete">🗑️</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
