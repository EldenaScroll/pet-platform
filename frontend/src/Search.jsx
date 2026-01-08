import { useState } from 'react'
import { supabase } from './supabaseClient'
import BookingModal from './BookingModal'


export default function Search() {
  const [zipCode, setZipCode] = useState('')
  const [radius, setRadius] = useState(10)
  const [sitters, setSitters] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedSitter, setSelectedSitter] = useState(null)


  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Get the current User's Token
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error("You must be logged in to search!")
      }

      const token = session.access_token
      // debug
      console.log("SENDING TOKEN:", token)
      // Call Backend
      const response = await fetch(`http://localhost:8081/api/search?zipCode=${zipCode}&radius=${radius}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Pass the JWT
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error("Search failed. Check Zip Code.")
      }

      const data = await response.json()
      setSitters(data)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Find a Sitter Nearby</h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
            <input 
              type="text" 
              placeholder="e.g. 10001"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="w-32">
            <label className="block text-sm font-medium text-gray-700 mb-1">Distance: {radius} mi</label>
            <input 
              type="range" 
              min="1" max="50" 
              value={radius} 
              onChange={(e) => setRadius(e.target.value)}
              className="w-full"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded border border-red-200">
            {error}
          </div>
        )}

        {/* Results Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {sitters.length === 0 && !loading && (
            <p className="text-gray-500 col-span-2 text-center mt-10">No sitters found yet. Try a different Zip Code!</p>
          )}

          {sitters.map((sitter) => (
            <div key={sitter.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                  🐶
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{sitter.email.split('@')[0]}</h3>
                  <p className="text-gray-500">
                    📍 {sitter.latitude.toFixed(3)}, {sitter.longitude.toFixed(3)}
                  </p>
                  <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    Sitter
                  </span>
                </div>
              </div>
              <button className="mt-4 w-full border border-blue-600 text-blue-600 py-2 rounded font-medium hover:bg-blue-50">
                View Profile
              </button>
              <button 
                onClick={() => setSelectedSitter(sitter)} // triggers the booking modal
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700"
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>
      {selectedSitter && (
        <BookingModal 
          sitter={selectedSitter} 
          onClose={() => setSelectedSitter(null)} 
        />
      )}
    </div>
  )
}