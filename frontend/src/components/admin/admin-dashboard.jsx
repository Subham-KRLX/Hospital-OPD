"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../auth/use-auth"
import API_URL from "../../config/api"
import SystemOverview from "./system-overview"
import UserManagement from "./user-management"
import BillingReports from "./billing-reports"
import AnalyticsCharts from "./analytics-charts"

export default function AdminDashboard() {
  const { getToken, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    completedAppointments: 0,
    totalRevenue: 0,
    pendingPayments: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = getToken()
        
        // Fetch real statistics from API
        const [usersRes, doctorsRes, patientsRes, appointmentsRes] = await Promise.all([
          fetch(`${API_URL}/api/auth/users`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/api/doctors`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/api/patients`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/api/appointments`, { headers: { Authorization: `Bearer ${token}` } })
        ])

        const users = usersRes.ok ? await usersRes.json() : []
        const doctors = doctorsRes.ok ? await doctorsRes.json() : []
        const patients = patientsRes.ok ? await patientsRes.json() : []
        const appointments = appointmentsRes.ok ? await appointmentsRes.json() : []

        const completedAppts = appointments.filter(a => a.status === 'COMPLETED').length
        const totalRevenue = completedAppts * 500 // Estimated average
        const pendingPayments = appointments.filter(a => a.status === 'SCHEDULED').length * 500

        setStats({
          totalUsers: users.length,
          totalPatients: patients.length,
          totalDoctors: doctors.length,
          totalAppointments: appointments.length,
          completedAppointments: completedAppts,
          totalRevenue,
          pendingPayments,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
        // Fallback to default values
        setStats({
          totalUsers: 0,
          totalPatients: 0,
          totalDoctors: 0,
          totalAppointments: 0,
          completedAppointments: 0,
          totalRevenue: 0,
          pendingPayments: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [getToken])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">🛡️ ADMINISTRATOR PANEL</h1>
            <p className="text-gray-700 font-semibold">System Management • User Control • Analytics • Billing</p>
          </div>
          <button
            onClick={logout}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition shadow-md"
          >
            Logout
          </button>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalUsers}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Doctors</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalDoctors}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Payments</p>
                <p className="text-3xl font-bold text-orange-600">₹{stats.pendingPayments.toLocaleString()}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {["overview", "users", "analytics", "billing"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold transition capitalize whitespace-nowrap ${
                activeTab === tab
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                  : "bg-white/80 text-gray-700 hover:bg-white border-2 border-purple-200"
              }`}
            >
              {tab === "overview" ? "📊 Overview" :
               tab === "users" ? "👥 Users" :
               tab === "analytics" ? "📈 Analytics" :
               "💰 Billing"}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "overview" && <SystemOverview stats={stats} />}
        {activeTab === "users" && <UserManagement />}
        {activeTab === "analytics" && <AnalyticsCharts stats={stats} />}
        {activeTab === "billing" && <BillingReports />}
      </div>
    </div>
  )
}
