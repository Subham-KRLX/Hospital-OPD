"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../auth/use-auth"
import API_URL from "../../config/api"

export default function AnalyticsCharts({ stats }) {
  const { getToken } = useAuth()
  const [loading, setLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState({
    appointments: [],
    doctors: [],
    patients: [],
  })

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const token = getToken()
        const [appointmentsRes, doctorsRes, patientsRes] = await Promise.all([
          fetch(`${API_URL}/api/appointments`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/api/doctors`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/api/patients`, { headers: { Authorization: `Bearer ${token}` } }),
        ])

        const appointments = appointmentsRes.ok ? await appointmentsRes.json() : []
        const doctors = doctorsRes.ok ? await doctorsRes.json() : []
        const patients = patientsRes.ok ? await patientsRes.json() : []

        setAnalyticsData({ appointments, doctors, patients })
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [getToken])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  const { appointments, doctors, patients } = analyticsData
  
  // Group appointments by status
  const statusGroups = {
    scheduled: appointments.filter(a => a.status === 'SCHEDULED').length,
    completed: appointments.filter(a => a.status === 'COMPLETED').length,
    cancelled: appointments.filter(a => a.status === 'CANCELLED').length,
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Analytics & Reports</h2>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Appointment Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Scheduled</span>
              <span className="font-bold text-blue-600">{statusGroups.scheduled}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completed</span>
              <span className="font-bold text-green-600">{statusGroups.completed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cancelled</span>
              <span className="font-bold text-red-600">{statusGroups.cancelled}</span>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">System Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Doctors</span>
              <span className="font-bold text-purple-600">{doctors.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Patients</span>
              <span className="font-bold text-blue-600">{patients.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Appointments</span>
              <span className="font-bold text-green-600">{appointments.length}</span>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completion Rate</span>
              <span className="font-bold text-green-600">
                {appointments.length > 0 ? Math.round((statusGroups.completed / appointments.length) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Doctors</span>
              <span className="font-bold text-blue-600">{doctors.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg per Doctor</span>
              <span className="font-bold text-purple-600">
                {doctors.length > 0 ? Math.round(appointments.length / doctors.length) : 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor List */}
      <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Doctor Directory</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="p-4 bg-gray-50 rounded-lg">
              <p className="font-bold text-gray-800">Dr. {doctor.name}</p>
              <p className="text-sm text-gray-600">{doctor.specialization || 'General Physician'}</p>
              <p className="text-xs text-gray-500 mt-2">Fee: ₹{doctor.consultationFee || 500}</p>
            </div>
          ))}
          {doctors.length === 0 && (
            <p className="text-gray-500 col-span-3 text-center py-8">No doctors registered yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Avg Appointments/Day</p>
          <p className="text-3xl font-bold text-blue-600">{(stats.totalAppointments / 30).toFixed(1)}</p>
          <p className="text-xs text-gray-600 mt-2">↑ 12% from last month</p>
        </div>

        <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Patient Satisfaction</p>
          <p className="text-3xl font-bold text-green-600">4.7/5.0</p>
          <p className="text-xs text-gray-600 mt-2">Based on 120 reviews</p>
        </div>

        <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">System Uptime</p>
          <p className="text-3xl font-bold text-purple-600">99.9%</p>
          <p className="text-xs text-gray-600 mt-2">Last 30 days</p>
        </div>
      </div>
    </div>
  )
}
