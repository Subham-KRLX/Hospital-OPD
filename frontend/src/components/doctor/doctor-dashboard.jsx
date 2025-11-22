"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../auth/use-auth"
import API_URL from "../../config/api"
import PatientQueueCard from "./patient-queue-card"
import SlotManagement from "./slot-management"

export default function DoctorDashboard() {
  const { user, getToken, logout } = useAuth()
  const [doctor, setDoctor] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("queue")

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const token = getToken()
        const response = await fetch(`${API_URL}/api/doctors?userId=${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const doctors = await response.json()
        if (doctors.length > 0) {
          setDoctor(doctors[0])

          // Fetch appointments
          const appointmentsRes = await fetch(`${API_URL}/api/appointments?doctorId=${doctors[0].id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          const appointmentsData = await appointmentsRes.json()
          setAppointments(appointmentsData)
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchDoctorData()
    }
  }, [user, getToken])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const todayAppointments = appointments
    .filter((a) => {
      const appointmentDate = new Date(a.slot.date).toDateString()
      const today = new Date().toDateString()
      return appointmentDate === today && a.status === "SCHEDULED"
    })
    .sort((a, b) => a.slot.startTime.localeCompare(b.slot.startTime))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome, Dr. {doctor?.name}</h1>
            <p className="text-gray-600">{doctor?.specialization}</p>
          </div>
          <button
            onClick={logout}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition shadow-md"
          >
            Logout
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Today's Appointments</p>
                <p className="text-3xl font-bold text-blue-600">{todayAppointments.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Patients</p>
                <p className="text-3xl font-bold text-green-600">
                  {new Set(appointments.map((a) => a.patientId)).size}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0H9m6 0H9m3-6.646V15m0 0v3m0-3H9m0 0v3m0-3h6"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Consultation Fee</p>
                <p className="text-3xl font-bold text-amber-600">${doctor?.consultationFee}</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-purple-600">{doctor?.rating.toFixed(1)}</p>
                  <span className="text-yellow-400 text-lg">★</span>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("queue")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "queue"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "bg-white/60 text-gray-700 hover:bg-white"
            }`}
          >
            Patient Queue
          </button>
          <button
            onClick={() => setActiveTab("slots")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "slots"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "bg-white/60 text-gray-700 hover:bg-white"
            }`}
          >
            Manage Slots
          </button>
        </div>

        {/* Content */}
        {activeTab === "queue" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Today's Patient Queue</h2>
            <div className="space-y-4">
              {todayAppointments.length > 0 ? (
                todayAppointments.map((appointment) => (
                  <PatientQueueCard key={appointment.id} appointment={appointment} doctorId={doctor?.id} />
                ))
              ) : (
                <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-8 text-center">
                  <p className="text-gray-600">No appointments scheduled for today</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "slots" && <SlotManagement doctorId={doctor?.id} />}
      </div>
    </div>
  )
}
