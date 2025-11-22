"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../auth/use-auth"
import API_URL from "../../config/api"

export default function UserManagement() {
  const { getToken } = useAuth()
  const [users, setUsers] = useState([])
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [actionMessage, setActionMessage] = useState("")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = getToken()
        
        // Fetch all users from database
        const usersRes = await fetch(`${API_URL}/api/auth/users`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        
        // Fetch doctors
        const doctorsRes = await fetch(`${API_URL}/api/doctors`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        
        // Fetch patients
        const patientsRes = await fetch(`${API_URL}/api/patients`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (usersRes.ok) {
          const usersData = await usersRes.json()
          setUsers(usersData)
        }
        
        if (doctorsRes.ok) {
          const doctorsData = await doctorsRes.json()
          setDoctors(doctorsData)
        }
        
        if (patientsRes.ok) {
          const patientsData = await patientsRes.json()
          setPatients(patientsData)
        }
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [getToken])

  const handleDeleteUser = async (userId, userRole) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return
    }

    try {
      const token = getToken()
      const response = await fetch(`${API_URL}/api/auth/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setUsers(users.filter((u) => u.id !== userId))
        setActionMessage("User deleted successfully")
        setTimeout(() => setActionMessage(""), 3000)
      } else {
        setActionMessage("Failed to delete user")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      setActionMessage("Error deleting user")
    }
  }

  const handleToggleUserStatus = async (userId) => {
    try {
      const token = getToken()
      const response = await fetch(`${API_URL}/api/auth/users/${userId}/toggle-status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUsers(users.map((u) => (u.id === userId ? updatedUser : u)))
        setActionMessage("User status updated")
        setTimeout(() => setActionMessage(""), 3000)
      }
    } catch (error) {
      console.error("Error toggling user status:", error)
    }
  }

  const getFilteredData = () => {
    if (filter === "doctor") return doctors
    if (filter === "patient") return patients
    // For "all", combine users with their profile data
    return users
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const filteredData = getFilteredData()

  return (
    <div>
      {actionMessage && (
        <div className="mb-4 p-4 bg-blue-100 text-blue-800 rounded-lg">
          {actionMessage}
        </div>
      )}
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Total: {users.length} users | Doctors: {doctors.length} | Patients: {patients.length}
          </p>
        </div>
        <div className="flex gap-2">
          {["all", "patient", "doctor"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-semibold capitalize transition ${
                filter === f ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {f === "all" ? `All Users (${users.length})` : f + "s (" + (f === "doctor" ? doctors.length : patients.length) + ")"}
            </button>
          ))}
        </div>
      </div>

      <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  {filter === "doctor" ? "Specialization" : filter === "patient" ? "Phone" : "Email"}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  {filter === "doctor" ? "Fee" : filter === "patient" ? "DOB" : "Role"}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No {filter === "all" ? "users" : filter + "s"} found
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-800 font-mono text-sm">#{item.id}</td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{item.name}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {filter === "doctor" ? item.specialization || "N/A" : 
                       filter === "patient" ? item.phone || "N/A" : 
                       item.email || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {filter === "doctor" ? `₹${item.consultationFee || 0}` :
                       filter === "patient" ? (item.dateOfBirth ? new Date(item.dateOfBirth).toLocaleDateString() : "N/A") :
                       <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                         item.role === "PATIENT" ? "bg-green-100 text-green-800" :
                         item.role === "DOCTOR" ? "bg-blue-100 text-blue-800" :
                         "bg-purple-100 text-purple-800"
                       }`}>{item.role}</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteUser(item.userId || item.id, item.role)}
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-semibold transition"
                        >
                          Delete
                        </button>
                        {filter === "doctor" && (
                          <button
                            onClick={() => window.location.href = `/doctor/${item.id}`}
                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-semibold transition"
                          >
                            View
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">Edit</button>
                    <button className="text-red-600 hover:text-red-700 font-semibold text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-gray-50 text-sm text-gray-600 font-semibold">
          Total: {filteredUsers.length} users
        </div>
      </div>
    </div>
  )
}
