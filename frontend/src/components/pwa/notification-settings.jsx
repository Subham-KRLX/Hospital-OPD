"use client"

import { useState, useEffect } from "react"
import {
  requestNotificationPermission,
  registerServiceWorker,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  sendTestNotification,
} from "../../lib/push-notifications"
import PushDiagnosticsPanel from "./push-diagnostics"

export default function NotificationSettings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const checkNotificationStatus = async () => {
      const permission = Notification.permission
      setNotificationsEnabled(permission === "granted")

      if (permission === "granted") {
        const registration = await navigator.serviceWorker.ready
        const sub = await registration.pushManager.getSubscription()
        setSubscription(sub)
      }
    }

    checkNotificationStatus()
  }, [])

  const handleToggleNotifications = async () => {
    setLoading(true)

    if (!notificationsEnabled) {
      // Enable notifications
      const permission = await requestNotificationPermission()
      if (permission) {
        await registerServiceWorker()
        const sub = await subscribeToPushNotifications()
        setSubscription(sub)
        setNotificationsEnabled(true)
        setMessage("Notifications enabled successfully!")
        await sendTestNotification("Notifications Enabled", {
          body: "You will now receive appointment and prescription notifications",
        })
      } else {
        setMessage("Permission denied for notifications")
      }
    } else {
      // Disable notifications
      await unsubscribeFromPushNotifications()
      setSubscription(null)
      setNotificationsEnabled(false)
      setMessage("Notifications disabled")
    }

    setLoading(false)
    setTimeout(() => setMessage(""), 3000)
  }

  return (
    <>
      <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Push Notifications</h3>

      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            message.includes("enabled") || message.includes("successfully")
              ? "bg-green-100 text-green-800"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {message}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-semibold text-gray-800">Appointment Reminders</p>
            <p className="text-sm text-gray-600">Get notified about upcoming appointments</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={handleToggleNotifications}
              disabled={loading}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-semibold text-gray-800">Prescription Updates</p>
            <p className="text-sm text-gray-600">Get notified when prescriptions are issued</p>
          </div>
          <input type="checkbox" disabled className="w-4 h-4 text-blue-600 rounded" checked={notificationsEnabled} />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-semibold text-gray-800">Lab Results</p>
            <p className="text-sm text-gray-600">Get notified when your lab results are ready</p>
          </div>
          <input type="checkbox" disabled className="w-4 h-4 text-blue-600 rounded" checked={notificationsEnabled} />
        </div>
      </div>

      {notificationsEnabled && subscription && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <p className="text-xs text-gray-600 font-medium mb-1">Status</p>
          <p className="text-sm text-green-700 font-semibold">✓ Notifications Active</p>
        </div>
      )}
      </div>
      <PushDiagnosticsPanel />
    </>
  )
}
