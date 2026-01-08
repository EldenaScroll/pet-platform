import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function BookingModal({ sitter, onClose }) {
  const [pets, setPets] = useState([])
  const [selectedPet, setSelectedPet] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [loading, setLoading] = useState(false)

  // fetch User's Pets on Mount
  useEffect(() => {
    async function fetchPets() {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session.access_token

      const res = await fetch('http://localhost:8081/api/pets', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setPets(data)
      if (data.length > 0) setSelectedPet(data[0].id)
    }
    fetchPets()
  }, [])

  // fandle form submit
  const handleBook = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session.access_token

      // calculate simplified price ($20/hour)
      const start = new Date(startTime)
      const end = new Date(endTime)
      const hours = (end - start) / 36e5
      const price = hours > 0 ? hours * 20 : 20

      const payload = {
        sitterId: sitter.id,
        petId: selectedPet,
        startTime: startTime + ":00", // Java needs seconds
        endTime: endTime + ":00",
        totalPrice: price
      }

      const res = await fetch('http://localhost:8081/api/bookings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {

        const errorText = await res.text() 
        throw new Error(errorText || "Booking Failed")
      }

      alert("Booking Request Sent!")
      onClose() // Close modal

    } catch (err) {
      alert("Error: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Book {sitter.email.split('@')[0]}</h2>
        
        <form onSubmit={handleBook} className="space-y-4">
          {/* Pet Selector */}
          <div>
            <label className="block text-sm font-medium">Select Pet</label>
            <select 
              value={selectedPet}
              onChange={(e) => setSelectedPet(e.target.value)}
              className="w-full border p-2 rounded"
            >
              {pets.map(pet => (
                <option key={pet.id} value={pet.id}>{pet.name} ({pet.breed})</option>
              ))}
            </select>
            {pets.length === 0 && <p className="text-red-500 text-xs">You need to add a pet first!</p>}
          </div>

          {/* Time Selectors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Start Time</label>
              <input 
                type="datetime-local" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">End Time</label>
              <input 
                type="datetime-local" 
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600">Cancel</button>
            <button 
              type="submit" 
              disabled={loading || pets.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Booking...' : 'Confirm Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}