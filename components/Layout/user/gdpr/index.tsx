"use client"
import { useMutation } from "@tanstack/react-query"
import { Download, Trash2, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function GDPRUserPage() {
  const requestDataMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/post/request-data", { method: "POST" })
      if (!res.ok) throw new Error("Failed to request data")
      return res.json()
    },
  })

  const deleteDataMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/post/request-data/removal", { method: "POST" })
      if (!res.ok) throw new Error("Failed to request data removal")
      return res.json()
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="relative max-w-2xl w-full">
        {/* Background gradient effect */}
        <div className="color-layout-card layout-blue"></div>

        <div className="relative backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 dark:border-[var(--3)]/50 p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">GDPR Data Controls</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
              Manage your personal data in compliance with GDPR regulations. You have the right to access and delete
              your information.
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Request Data Card */}
            <div className="rounded-xl p-6 border border-gray-200/50 dark:border-[var(--2)]/50">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                  <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Request Your Data</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Request a complete copy of all your personal data stored in our systems.
              </p>
              <button
                className="w-full px-4 py-3 bg-primary hover:bg-secondary text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                onClick={() => requestDataMutation.mutate()}
                disabled={requestDataMutation.isPending}
              >
                {requestDataMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Request My Data
                  </>
                )}
              </button>
            </div>

            {/* Delete Data Card */}
            <div className="bg-red-50/80 dark:bg-red-900/20 rounded-xl p-6 border border-red-200/50 dark:border-red-800/50">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mr-3">
                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Delete Your Data</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Permanently remove your account and all associated data. This action cannot be undone.
              </p>
              <button
                className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                onClick={() => deleteDataMutation.mutate()}
                disabled={deleteDataMutation.isPending}
              >
                {deleteDataMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete My Data
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Status Messages */}
          {(requestDataMutation.isSuccess ||
            deleteDataMutation.isSuccess ||
            requestDataMutation.isError ||
            deleteDataMutation.isError) && (
            <div className="space-y-3">
              {requestDataMutation.isSuccess && (
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">Data Request Submitted</p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      We'll send your data export to your registered email address within 30 days.
                    </p>
                  </div>
                </div>
              )}

              {deleteDataMutation.isSuccess && (
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-red-800 dark:text-red-200">Deletion Request Submitted</p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Your account and all data will be permanently deleted within 30 days.
                    </p>
                  </div>
                </div>
              )}

              {(requestDataMutation.isError || deleteDataMutation.isError) && (
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-red-800 dark:text-red-200">Request Failed</p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Something went wrong. Please try again or contact support if the issue persists.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-[var(--3)]/50">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              These actions are processed in accordance with GDPR Article 15 (Right of Access) and Article 17 (Right to
              Erasure). For questions, contact our Data Protection Officer.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
