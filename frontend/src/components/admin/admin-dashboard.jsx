"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../auth/use-auth"
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
        // In a real app, you would fetch from admin analytics endpoint
        setStats({
          totalUsers: 250,
          totalPatients: 180,
          totalDoctors: 35,
          totalAppointments: 1240,
          completedAppointments: 1100,
          totalRevenue: 125000,
          pendingPayments: 18500,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Hospital OPD Management System Overview</p>
          </div>
          <button
            onClick={logout}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition shadow-md"
          >
            Logout
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {["overview", "users", "analytics", "billing"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold transition capitalize whitespace-nowrap ${
                activeTab === tab
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  : "bg-white/60 text-gray-700 hover:bg-white"
              }`}
            >
              {tab}
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
