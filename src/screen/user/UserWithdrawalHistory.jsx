import React, { useEffect, useState } from 'react'
import { getWithdrawalHistory } from '../../api/user.api'
import mainContent from '../../utils/mainContent'
import { dateFormatter } from '../../utils/AdditionalFn'

const StatusBadge = ({ status }) => {
  const styles = {
    completed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    failed: 'bg-red-100 text-red-700',
  }
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${styles[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}

const truncateHash = (hash) => `${hash.slice(0, 6)}...${hash.slice(-4)}`

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })

const UserWithdrawalHistory = () => {
  const [withdrawals, setWithdrawals] = useState([])
  const [loading, setLoading] = useState(false)

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
          <div key={w?._id} className="bg-black/50 border border-[var(--primary-color)]/40 rounded-2xl p-4 space-y-3">

            {/* Top row: amount + status */}
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1 justify-start">
                  <p className="text-base font-medium text-green-400">{w?.amount?.toFixed(2) || 0}</p>
                </div>
                <p className="text-sm text-gray-400 mt-0.5">{dateFormatter(w?.createdAt)}</p>
              </div>
              <StatusBadge status={w?.status} />
            </div>
            <div className="border-t border-gray-700" />

            {/* Details */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Tx hash</span>
                {/* <a
                  href={`https://etherscan.io/tx/${w.transactionHash}`}
                  target="_blank" rel="noopener noreferrer"
                  className="font-mono text-xs text-blue-400">
                  {truncateHash(w.transactionHash)}
                </a> */}
                <a
                  href={`https://etherscan.io/tx/${w?.transactionHash}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-[var(--primary-color)] text-xs cursor-pointer hover:underline text-center"
                >
                  View TX → {w?.transactionHash?.slice(0, 12)}...
                </a>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default UserWithdrawalHistory