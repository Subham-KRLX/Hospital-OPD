"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../auth/use-auth"
import API_URL from "../../config/api"
import AppointmentCard from "./appointment-card"
import MedicalHistoryCard from "./medical-history-card"
import QuickBooking from "./quick-booking"

export default function PatientDashboard() {
  const { user, getToken, logout } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = getToken()
        const response = await fetch(`${API_URL}/api/patients/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()
        setPatient(data)

        const appointmentsRes = await fetch(`${API_URL}/api/appointments?patientId=${data.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const appointmentsData = await appointmentsRes.json()
        setAppointments(appointmentsData)
      } catch (error) {
        console.error("Error fetching patient data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchPatientData()
    }
  }, [user, getToken])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome back, {patient?.name}</h1>
            <p className="text-gray-600">Here's your health overview</p>
          </div>
          <button
            onClick={logout}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition shadow-md"
          >
            Logout
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Upcoming Appointments</p>
                <p className="text-3xl font-bold text-blue-600">
                  {appointments.filter((a) => a.status === "SCHEDULED").length}
                </p>
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
                <p className="text-gray-600 text-sm font-medium">Total Appointments</p>
                <p className="text-3xl font-bold text-green-600">{appointments.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Last Visit</p>
                <p className="text-lg font-bold text-amber-600">{appointments.length > 0 ? "Completed" : "None"}</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Appointments</h2>
            <div className="space-y-4">
              {appointments
                .filter((a) => a.status === "SCHEDULED")
                .sort((a, b) => new Date(a.slot.date) - new Date(b.slot.date))
                .map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              {appointments.filter((a) => a.status === "SCHEDULED").length === 0 && (
                <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-8 text-center">
                  <p className="text-gray-600">No upcoming appointments</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <QuickBooking patientId={patient?.id} />
            <MedicalHistoryCard patient={patient} />
          </div>
        </div>
      </div>
    </div>
  )
}
