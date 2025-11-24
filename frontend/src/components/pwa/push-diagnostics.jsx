"use client"

import { useMemo, useState } from "react"
import { usePushDiagnostics } from "../../hooks/use-push-diagnostics"

const badgeColors = {
  success: "bg-emerald-100 text-emerald-800 border-emerald-200",
  warning: "bg-amber-100 text-amber-800 border-amber-200",
  danger: "bg-rose-100 text-rose-800 border-rose-200",
  info: "bg-blue-100 text-blue-800 border-blue-200",
}

const StatusBadge = ({ label, variant = "info" }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badgeColors[variant]}`}>{label}</span>
)

const formatEndpoint = (subscription) => {
  if (!subscription?.endpoint) return "—"
  const { endpoint } = subscription
  return `${endpoint.slice(0, 32)}…${endpoint.slice(-12)}`
}

const formatDate = (isoDate) => {
  if (!isoDate) return "No expiration"
  const date = new Date(isoDate)
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
}

const defaultPayload = {
  title: "OPD Reminder",
  body: "This is a quick verification message from the OPD dashboard.",
  data: { type: "diagnostic:test" },
}

export default function PushDiagnosticsPanel() {
  const { diagnostics, loading, refreshDiagnostics, resubscribe, removeSubscription, triggerTestNotification } = usePushDiagnostics()
  const [copied, setCopied] = useState(false)
  const [sendingTest, setSendingTest] = useState(false)
  const [testPayload, setTestPayload] = useState(defaultPayload)
  const [payloadInput, setPayloadInput] = useState(JSON.stringify(defaultPayload, null, 2))

  const subscriptionPreview = useMemo(() => {
    if (!diagnostics.subscription) return null
    return JSON.stringify(diagnostics.subscription.toJSON(), null, 2)
  }, [diagnostics.subscription])

  const handleCopy = async () => {
    if (!subscriptionPreview) return
    if (!navigator?.clipboard) return
    await navigator.clipboard.writeText(subscriptionPreview)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleResubscribe = async () => {
    await resubscribe()
    refreshDiagnostics()
  }

  const handleSendTest = async () => {
    setSendingTest(true)
    await triggerTestNotification(testPayload)
    setSendingTest(false)
  }

  return (
    <div className="mt-6 border border-dashed border-blue-200 rounded-2xl p-6 bg-white/80">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">Notification Health Monitor</h4>
          <p className="text-sm text-gray-600">Inspect the browser capability, service worker status, and push subscription details.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={refreshDiagnostics}
            className="px-4 py-2 rounded-lg border border-blue-200 bg-white text-blue-600 text-sm font-semibold hover:bg-blue-50 transition"
            disabled={loading}
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
          <button
            onClick={handleResubscribe}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60"
            disabled={loading}
          >
            Re-subscribe
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
          <p className="text-xs uppercase text-gray-500 mb-1">Browser Support</p>
          <StatusBadge label={diagnostics.isSupported ? "Supported" : "Unsupported"} variant={diagnostics.isSupported ? "success" : "danger"} />
        </div>
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
          <p className="text-xs uppercase text-gray-500 mb-1">Push Manager</p>
          <StatusBadge
            label={diagnostics.pushManagerSupported ? "Available" : "Missing"}
            variant={diagnostics.pushManagerSupported ? "success" : "danger"}
          />
        </div>
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
          <p className="text-xs uppercase text-gray-500 mb-1">Permission</p>
          <StatusBadge
            label={diagnostics.permission}
            variant={
              diagnostics.permission === "granted" ? "success" : diagnostics.permission === "denied" ? "danger" : "warning"
            }
          />
        </div>
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
          <p className="text-xs uppercase text-gray-500 mb-1">Service Worker</p>
          <StatusBadge label={diagnostics.workerState} variant="info" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-900">Subscription Details</p>
            {diagnostics.subscription ? (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">Active</span>
            ) : (
              <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-3 py-1 rounded-full">Missing</span>
            )}
          </div>

          <dl className="mt-4 space-y-3 text-sm text-gray-700">
            <div className="flex justify-between gap-3">
              <dt className="text-gray-500">Endpoint</dt>
              <dd className="font-mono text-xs break-all text-right">{formatEndpoint(diagnostics.subscription)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-gray-500">Scope</dt>
              <dd className="font-medium text-right">{diagnostics.scope || "—"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-gray-500">Retries</dt>
              <dd className="font-medium text-right">{diagnostics.subscription ? "Delegated to push service" : "Not applicable"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-gray-500">Expires</dt>
              <dd className="font-medium text-right">{formatDate(diagnostics.subscriptionExpiresAt)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-gray-500">Minutes left</dt>
              <dd className="font-medium text-right">
                {diagnostics.subscriptionTimeToExpiryMinutes ?? "Unknown"}
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={handleCopy}
              className="px-4 py-2 text-xs font-semibold border border-gray-300 rounded-lg hover:bg-white transition disabled:opacity-60"
              disabled={!subscriptionPreview}
            >
              {copied ? "Copied!" : "Copy JSON"}
            </button>
            <button
              onClick={removeSubscription}
              className="px-4 py-2 text-xs font-semibold border border-rose-200 text-rose-600 rounded-lg hover:bg-rose-50 transition disabled:opacity-60"
              disabled={!diagnostics.subscription || loading}
            >
              Remove Subscription
            </button>
          </div>
        </div>

        <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="font-semibold text-gray-900">Issues & Insights</p>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {diagnostics.issues.length === 0 ? (
              <li className="text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">No issues detected.</li>
            ) : (
              diagnostics.issues.map((issue, index) => (
                <li key={`${issue}-${index}`} className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  {issue}
                </li>
              ))
            )}
          </ul>

          <div className="mt-5">
            <label className="text-sm font-semibold text-gray-700">Custom Test Payload</label>
            <textarea
              value={payloadInput}
              onChange={(event) => {
                const value = event.target.value
                setPayloadInput(value)
                try {
                  setTestPayload(JSON.parse(value))
                } catch {
                  // ignore JSON parse errors while typing
                }
              }}
              className="mt-2 w-full min-h-[120px] text-xs font-mono rounded-lg border border-gray-200 p-3 focus:ring-2 focus:ring-blue-100 focus:outline-none bg-white"
            />
            <button
              onClick={handleSendTest}
              className="mt-3 w-full px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-60"
              disabled={sendingTest}
            >
              {sendingTest ? "Sending…" : "Send Test Notification"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


