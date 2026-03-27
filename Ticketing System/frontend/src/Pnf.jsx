import React from 'react'
import { Link } from "react-router-dom";
import { FaTicketAlt, FaBug, FaRobot } from "react-icons/fa";

export default function Pnf() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="absolute top-10 left-10 text-6xl text-blue-300 animate-bounce">
        <FaTicketAlt />
      </div>
      <div className="absolute bottom-20 right-20 text-6xl text-red-300 animate-bounce delay-500">
        <FaRobot />
      </div>
      <div className="absolute top-1/2 right-1/3 text-5xl text-green-300 animate-bounce delay-1000">
        <FaBug />
      </div>

      <h1 className="text-9xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6 text-gray-700">Sorry, the page was not found!</p>
      <Link
        to="/home"
        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
      >
        Back to Home
      </Link>
    </div>
  )
}
