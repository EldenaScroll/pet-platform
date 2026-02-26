import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { Link, useNavigate } from 'react-router-dom'

export default function SitterRequests() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const getToken = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { navigate('/login'); return null }
        return session.access_token
    }

    const fetchBookings = async () => {
        const token = await getToken()
        if (!token) return

        const res = await fetch('http://localhost:8081/api/bookings/sitter', {
            headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
            setBookings(await res.json())
        }
        setLoading(false)
    }

    useEffect(() => { fetchBookings() }, [])

    const updateStatus = async (bookingId, status) => {
        const token = await getToken()
        if (!token) return

        const res = await fetch(`http://localhost:8081/api/bookings/${bookingId}/status`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        })

        if (res.ok) {
            fetchBookings() // Refresh list
        } else {
            alert('Failed to update booking status')
        }
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return '—'
        return new Date(dateStr).toLocaleString('en-US', {
            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
        })
    }

    const getStatusBadge = (status) => {
        const styles = {
            PENDING: 'badge-pending',
            ACCEPTED: 'badge-accepted',
            REJECTED: 'badge-rejected',
            COMPLETED: 'badge-completed',
            PAID: 'badge-paid',
        }
        return <span className={`status-badge ${styles[status] || ''}`}>{status}</span>
    }

    if (loading) return <div className="page-center"><p>Loading...</p></div>

    const pendingBookings = bookings.filter(b => b.status === 'PENDING')
    const otherBookings = bookings.filter(b => b.status !== 'PENDING')

    return (
        <div className="page-container">
            <div className="page-header">
                <Link to="/dashboard" className="back-link">← Dashboard</Link>
                <h1 className="page-title">Incoming Requests</h1>
            </div>

            {/* Pending Requests */}
            {pendingBookings.length > 0 && (
                <div className="section">
                    <h2 className="section-title">⏳ Pending ({pendingBookings.length})</h2>
                    <div className="bookings-list">
                        {pendingBookings.map(booking => (
                            <div key={booking.id} className="booking-card request-card">
                                <div className="booking-card-top">
                                    <div>
                                        <p className="booking-time">{formatDate(booking.startTime)} → {formatDate(booking.endTime)}</p>
                                        <p className="booking-price">${booking.totalPrice?.toFixed(2) || '0.00'}</p>
                                    </div>
                                    {getStatusBadge(booking.status)}
                                </div>
                                <div className="request-actions">
                                    <button
                                        onClick={() => updateStatus(booking.id, 'ACCEPTED')}
                                        className="btn-accept"
                                    >
                                        ✓ Accept
                                    </button>
                                    <button
                                        onClick={() => updateStatus(booking.id, 'REJECTED')}
                                        className="btn-reject"
                                    >
                                        ✕ Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Other Bookings */}
            {otherBookings.length > 0 && (
                <div className="section">
                    <h2 className="section-title">📋 All Requests</h2>
                    <div className="bookings-list">
                        {otherBookings.map(booking => (
                            <div key={booking.id} className="booking-card">
                                <div className="booking-card-top">
                                    <div>
                                        <p className="booking-time">{formatDate(booking.startTime)} → {formatDate(booking.endTime)}</p>
                                        <p className="booking-price">${booking.totalPrice?.toFixed(2) || '0.00'}</p>
                                    </div>
                                    {getStatusBadge(booking.status)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {bookings.length === 0 && (
                <div className="empty-state">
                    <span className="empty-icon">📬</span>
                    <p>No incoming requests yet.</p>
                </div>
            )}
        </div>
    )
}
