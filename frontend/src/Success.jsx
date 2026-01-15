import { Link } from 'react-router-dom'

export default function Success() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-green-50 text-center p-4">
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="text-3xl font-bold text-green-800">Payment Successful!</h1>
      <p className="text-gray-600 mt-2">Your booking has been confirmed.</p>
      <Link to="/search" className="mt-8 bg-green-600 text-white px-6 py-2 rounded font-bold">
        Back to Search
      </Link>
    </div>
  )
}