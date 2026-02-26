import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { Link, useNavigate } from 'react-router-dom'

export default function MyBookings() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchBookings() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) { navigate('/login'); return }

            const res = await fetch('http://localhost:8081/api/bookings', {
                headers: { Authorization: `Bearer ${session.access_token}` }
            })
            if (res.ok) {
                setBookings(await res.json())
            }
            setLoading(false)
        }
        fetchBookings()
    }, [navigate])

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

    const formatDate = (dateStr) => {
        if (!dateStr) return '—'
        return new Date(dateStr).toLocaleString('en-US', {
            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
        })
    }

    if (loading) return <div className="page-center"><p>Loading...</p></div>

    return (
        <div className="page-container">
            <div className="page-header">
                <Link to="/dashboard" className="back-link">← Dashboard</Link>
                <h1 className="page-title">My Bookings</h1>
            </div>

            {bookings.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">📋</span>
                    <p>No bookings yet. Find a sitter to get started!</p>
                </div>
            ) : (
                <div className="bookings-list">
                    {bookings.map(booking => (
                        <div key={booking.id} className="booking-card">
                            <div className="booking-card-top">
                                <div>
                                    <p className="booking-time">{formatDate(booking.startTime)} → {formatDate(booking.endTime)}</p>
                                    <p className="booking-price">${booking.totalPrice?.toFixed(2) || '0.00'}</p>
                                </div>
                                {getStatusBadge(booking.status)}
                            </div>
                            <div className="booking-card-bottom">
                                <span className="booking-id">Booking #{booking.id?.substring(0, 8)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
