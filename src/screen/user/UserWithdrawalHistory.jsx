import React, { useEffect, useState } from 'react'
import { getWithdrawalHistory } from '../../api/user.api'
import { dateFormatter } from '../../utils/AdditionalFn'
import { X } from 'lucide-react'

const StatusBadge = ({ status }) => {
  const styles = {
    completed: 'bg-green-100 text-green-700',
    pending: 'bg-blue-100 text-blue-700',
    failed: 'bg-red-100 text-red-700',
    rejected: 'bg-red-100 text-red-700',
  }
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${styles[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between text-sm py-1.5">
    <span className="text-gray-500">{label}</span>
    <span className="text-gray-900 font-medium text-right break-all">{value || '-'}</span>
  </div>
)

const WithdrawalDetailsModal = ({ withdrawal, onClose }) => {
  if (!withdrawal) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white border border-blue-100 shadow-xl rounded-2xl p-5 max-h-[85vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-all"
        >
          <X size={16} />
        </button>

        <div className="mb-4">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Amount</p>
          <p className="text-2xl font-semibold text-blue-600">
            ₹{withdrawal?.amount?.toFixed(2)}
          </p>
        </div>

        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-500 text-sm">Status</span>
          <StatusBadge status={withdrawal?.status} />
        </div>

        <div className="border-t border-gray-100 my-2" />

        {/* Bank details */}
        <p className="text-gray-500 text-xs uppercase tracking-wider mt-3 mb-1">Bank Details</p>
        <DetailRow label="Bank Name" value={withdrawal?.bankName} />
        <DetailRow label="Account Number" value={withdrawal?.accountNumber} />
        <DetailRow label="IFSC Code" value={withdrawal?.ifscCode?.toUpperCase()} />
        <DetailRow label="UPI ID" value={withdrawal?.upiId} />

        <div className="border-t border-gray-100 my-2" />

        <DetailRow label="Fee" value={`₹${withdrawal?.feeAmount?.toFixed(2) || 0}`} />
        <DetailRow label="Requested On" value={dateFormatter(withdrawal?.createdAt)} />
        {withdrawal?.approvedDate && (
          <DetailRow label="Approved On" value={dateFormatter(withdrawal?.approvedDate)} />
        )}

        {/* Rejection reason - only if rejected/failed and reason exists */}
        {withdrawal?.rejectionReason && (
          <>
            <div className="border-t border-gray-100 my-2" />
            <p className="text-gray-500 text-xs uppercase tracking-wider mt-3 mb-1">Rejection Reason</p>
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3 mt-1">
              {withdrawal.rejectionReason}
            </p>
          </>
        )}
      </div>
    </div>
  )
}

const UserWithdrawalHistory = () => {
  const [withdrawals, setWithdrawals] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null)

  const fetchWithdrawals = async () => {
    setLoading(true)
    try {
      const response = await getWithdrawalHistory()
      if (response?.success) setWithdrawals(response.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchWithdrawals() }, [])

  if (loading) return (
    <div className="flex justify-center items-center py-16 text-gray-400 text-sm">
      Loading...
    </div>
  )

  return (
    <div className="space-y-3">
      {withdrawals.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-10">No withdrawals yet.</p>
      ) : (
        withdrawals.map((w) => (
          <div key={w?._id} className="bg-white shadow-sm border border-gray-300 rounded-2xl p-4 space-y-3">

            {/* Top row: amount + status */}
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1 justify-start">
                  <p className="text-base font-medium text-green-400">₹{w?.amount?.toFixed(2) || 0}</p>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{dateFormatter(w?.createdAt)}</p>
              </div>
              <StatusBadge status={w?.status} />
            </div>
            <div className="border-t border-gray-700" />

            {/* Details */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">{w?.bankName} • {w?.accountNumber?.slice(-4)?.padStart(w?.accountNumber?.length || 4, '•')}</span>
              <button
                onClick={() => setSelectedWithdrawal(w)}
                className="text-[var(--primary-color)] text-xs font-medium cursor-pointer hover:underline"
              >
                View →
              </button>
            </div>
          </div>
        ))
      )}

      <WithdrawalDetailsModal
        withdrawal={selectedWithdrawal}
        onClose={() => setSelectedWithdrawal(null)}
      />
    </div>
  )
}

export default UserWithdrawalHistory