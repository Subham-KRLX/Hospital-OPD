import { useCallback, useEffect, useMemo, useState } from "react"
import {
  registerServiceWorker,
  requestNotificationPermission,
  sendTestNotification,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
} from "../lib/push-notifications"

const initialDiagnostics = {
  isBrowser: false,
  isSupported: false,
  pushManagerSupported: false,
  permission: "default",
  workerState: "unknown",
  scope: null,
  subscription: null,
  subscriptionExpiresAt: null,
  subscriptionTimeToExpiryMinutes: null,
  lastUpdated: null,
  lastError: null,
}

const resolveWorkerState = (registration) => {
  if (!registration) return "unregistered"
  if (registration.active) return `active:${registration.active.state}`
  if (registration.installing) return `installing:${registration.installing.state}`
  if (registration.waiting) return `waiting:${registration.waiting.state}`
  return "registered"
}

const safePermission = () => {
  if (typeof Notification === "undefined") return "unsupported"
  return Notification.permission
}

const minutesUntil = (expirationTime) => {
  if (!expirationTime) return null
  const diff = expirationTime - Date.now()
  return diff > 0 ? Math.round(diff / 60000) : 0
}

export const usePushDiagnostics = () => {
  const [diagnostics, setDiagnostics] = useState(initialDiagnostics)
  const [loading, setLoading] = useState(false)

  const refreshDiagnostics = useCallback(async () => {
    const isBrowser = typeof window !== "undefined"
    if (!isBrowser) return

    setLoading(true)
    try {
      const swSupported = "serviceWorker" in navigator
      const pushSupported = "PushManager" in window
      let workerState = "unregistered"
      let scope = null
      let subscription = null
      let expiresAt = null
      let minutesToExpiry = null

      if (swSupported) {
        const registration = await navigator.serviceWorker.ready.catch(() => null)
        workerState = resolveWorkerState(registration)
        scope = registration?.scope ?? null
        subscription = registration ? await registration.pushManager.getSubscription() : null

        if (subscription?.expirationTime) {
          expiresAt = new Date(subscription.expirationTime).toISOString()
          minutesToExpiry = minutesUntil(subscription.expirationTime)
        }
      }

      setDiagnostics({
        isBrowser: true,
        isSupported: swSupported,
        pushManagerSupported: pushSupported,
        permission: safePermission(),
        workerState,
        scope,
        subscription,
        subscriptionExpiresAt: expiresAt,
        subscriptionTimeToExpiryMinutes: minutesToExpiry,
        lastUpdated: new Date().toISOString(),
        lastError: null,
      })
    } catch (error) {
      setDiagnostics((prev) => ({
        ...prev,
        isBrowser: true,
        lastUpdated: new Date().toISOString(),
        lastError: error.message || "Unexpected diagnostics error",
      }))
    } finally {
      setLoading(false)
    }
  }, [])

  const resubscribe = useCallback(async () => {
    setLoading(true)
    try {
      const granted = await requestNotificationPermission()
      if (!granted) {
        throw new Error("Notification permission was not granted")
      }

      const registration = await registerServiceWorker()
      if (!registration) {
        throw new Error("Service Worker could not be registered")
      }

      await unsubscribeFromPushNotifications()
      const newSubscription = await subscribeToPushNotifications()

      if (!newSubscription) {
        throw new Error("Push subscription failed")
      }

      const expiresAt = newSubscription.expirationTime ? new Date(newSubscription.expirationTime).toISOString() : null

      setDiagnostics((prev) => ({
        ...prev,
        permission: safePermission(),
        workerState: resolveWorkerState(registration),
        subscription: newSubscription,
        subscriptionExpiresAt: expiresAt,
        subscriptionTimeToExpiryMinutes: minutesUntil(newSubscription.expirationTime),
        lastUpdated: new Date().toISOString(),
        lastError: null,
      }))

      return newSubscription
    } catch (error) {
      setDiagnostics((prev) => ({
        ...prev,
        lastUpdated: new Date().toISOString(),
        lastError: error.message || "Failed to refresh subscription",
      }))
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const removeSubscription = useCallback(async () => {
    setLoading(true)
    try {
      const result = await unsubscribeFromPushNotifications()
      if (!result) {
        throw new Error("No subscription found to remove")
      }

      setDiagnostics((prev) => ({
        ...prev,
        subscription: null,
        subscriptionExpiresAt: null,
        subscriptionTimeToExpiryMinutes: null,
        lastUpdated: new Date().toISOString(),
        lastError: null,
      }))

      return true
    } catch (error) {
      setDiagnostics((prev) => ({
        ...prev,
        lastUpdated: new Date().toISOString(),
        lastError: error.message || "Failed to remove subscription",
      }))
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const triggerTestNotification = useCallback(async ({ title, body, data }) => {
    try {
      await sendTestNotification(title || "Test Notification", {
        body: body || "Push notifications are working!",
        data,
      })
      setDiagnostics((prev) => ({
        ...prev,
        lastUpdated: new Date().toISOString(),
        lastError: null,
      }))
      return true
    } catch (error) {
      setDiagnostics((prev) => ({
        ...prev,
        lastUpdated: new Date().toISOString(),
        lastError: error.message || "Failed to dispatch test notification",
      }))
      return false
    }
  }, [])

  useEffect(() => {
    refreshDiagnostics()
  }, [refreshDiagnostics])

  const issues = useMemo(() => {
    const detected = []
    if (!diagnostics.isSupported) detected.push("Service workers are not supported in this browser.")
    if (diagnostics.isSupported && !diagnostics.pushManagerSupported) detected.push("Push Manager API unavailable.")
    if (diagnostics.permission === "denied") detected.push("User has denied notification permission.")
    if (diagnostics.subscription == null && diagnostics.permission === "granted")
      detected.push("No active push subscription. Try re-subscribing.")
    if (diagnostics.subscriptionTimeToExpiryMinutes !== null && diagnostics.subscriptionTimeToExpiryMinutes < 30)
      detected.push("Subscription expires soon. Consider refreshing it.")
    if (diagnostics.lastError) detected.push(diagnostics.lastError)
    return detected
  }, [diagnostics])

  return {
    diagnostics: { ...diagnostics, issues },
    loading,
    refreshDiagnostics,
    resubscribe,
    removeSubscription,
    triggerTestNotification,
  }
}


