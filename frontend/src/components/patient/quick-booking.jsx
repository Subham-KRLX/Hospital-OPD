"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../auth/use-auth"
import API_URL from "../../config/api"

export default function QuickBooking({ patientId }) {
  const { getToken } = useAuth()
  const [doctors, setDoctors] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [symptoms, setSymptoms] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${API_URL}/api/doctors`)
        const data = await response.json()
        setDoctors(data)
      } catch (error) {
        console.error("Error fetching doctors:", error)
      }
    }

    fetchDoctors()
  }, [])

  const handleDoctorSelect = async (doctorId) => {
    setSelectedDoctor(doctorId)
    setSelectedSlot(null)

    try {
      const response = await fetch(`${API_URL}/api/slots/doctor/${doctorId}`)
      const data = await response.json()
      setSlots(data)
    } catch (error) {
      console.error("Error fetching slots:", error)
    }
  }

  const handleBooking = async () => {
    if (!selectedSlot) {
      setMessage("Please select a time slot")
      return
    }

    setLoading(true)
    try {
      const token = getToken()
      const response = await fetch(`${API_URL}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patientId,
          doctorId: selectedDoctor,
          slotId: selectedSlot,
          symptoms,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage("Booking failed: " + (data.error || "Unknown error"))
        return
      }

      setMessage("Appointment booked successfully!")
      setSelectedDoctor(null)
      setSelectedSlot(null)
      setSymptoms("")
      setSlots([])

      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Error booking appointment")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Book Appointment</h3>

      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            message.includes("successfully") ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
          }`}
        >
          {message}
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Doctor</label>
          <select
            value={selectedDoctor || ""}
            onChange={(e) => handleDoctorSelect(Number.parseInt(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 text-sm"
          >
            <option value="">Choose a doctor...</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                Dr. {doctor.name} - {doctor.specialization || 'General'}
              </option>
            ))}
          </select>
        </div>

        {selectedDoctor && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Time Slot</label>
            {slots.length > 0 ? (
              <select
                value={selectedSlot || ""}
                onChange={(e) => setSelectedSlot(Number.parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 text-sm"
              >
                <option value="">Choose a time...</option>
                {slots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {new Date(slot.date).toLocaleDateString()} - {slot.startTime}
                  </option>
                ))}
              </select>
            ) : (
              <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
                No available slots for this doctor. Please select another doctor or contact the hospital.
              </div>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Symptoms (Optional)</label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 text-sm"
            placeholder="Describe your symptoms..."
            rows="3"
          />
        </div>

        <button
          onClick={handleBooking}
          disabled={loading || !selectedDoctor}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 text-sm"
        >
          {loading ? "Booking..." : "Book Now"}
        </button>
      </div>
    </div>
  )
}
