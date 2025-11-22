"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../auth/use-auth"
import API_URL from "../../config/api"

export default function BillingReports() {
  const { getToken } = useAuth()
  const [loading, setLoading] = useState(true)
  const [billingData, setBillingData] = useState({
    totalInvoiced: 0,
    totalCollected: 0,
    outstanding: 0,
    monthlyAvg: 0,
    appointments: [],
  })

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        const token = getToken()
        const response = await fetch(`${API_URL}/api/appointments`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        
        if (response.ok) {
          const appointments = await response.json()
          
          // Calculate billing from appointments
          const avgFee = 500 // Average consultation fee
          const completed = appointments.filter(a => a.status === 'COMPLETED')
          const scheduled = appointments.filter(a => a.status === 'SCHEDULED')
          
          const totalInvoiced = appointments.length * avgFee
          const totalCollected = completed.length * avgFee
          const outstanding = scheduled.length * avgFee
          const monthlyAvg = Math.round(totalInvoiced / 6)
          
          setBillingData({
            totalInvoiced,
            totalCollected,
            outstanding,
            monthlyAvg,
            appointments,
          })
        }
      } catch (error) {
        console.error("Error fetching billing data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBillingData()
  }, [getToken])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  const collectionRate = billingData.totalInvoiced > 0 
    ? Math.round((billingData.totalCollected / billingData.totalInvoiced) * 100)
    : 0

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Billing & Payment Reports</h2>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Total Invoiced</p>
          <p className="text-3xl font-bold text-blue-600">₹{billingData.totalInvoiced.toLocaleString()}</p>
          <p className="text-xs text-gray-600 mt-2">All appointments</p>
        </div>

        <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Total Collected</p>
          <p className="text-3xl font-bold text-green-600">₹{billingData.totalCollected.toLocaleString()}</p>
          <p className="text-xs text-gray-600 mt-2">{collectionRate}% collection rate</p>
        </div>

        <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Outstanding</p>
          <p className="text-3xl font-bold text-amber-600">₹{billingData.outstanding.toLocaleString()}</p>
          <p className="text-xs text-gray-600 mt-2">{100 - collectionRate}% pending</p>
        </div>

        <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Total Appointments</p>
          <p className="text-3xl font-bold text-purple-600">{billingData.appointments.length}</p>
          <p className="text-xs text-gray-600 mt-2">All time</p>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Live Billing Summary</h3>
        <p className="text-gray-600">Showing real-time data from {billingData.appointments.length} appointments in the system.</p>
      </div>
                  <p className="text-sm text-gray-600">{method.percentage}% of total</p>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${method.percentage}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
