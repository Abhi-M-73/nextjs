import React, { useEffect, useState } from 'react'
import { addBankAccount, getBankAccount } from '../api/user.api'
import toast from 'react-hot-toast'

const UserBankAccount = () => {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [bankData, setBankData] = useState(null)
    const [form, setForm] = useState({
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        upiId: '',
    })

    const fetchBankAccount = async () => {
        try {
            setLoading(true)
            const res = await getBankAccount()
            if (res?.success && res?.data) {
                const bank = res.data
                setBankData(bank)
                setForm({
                    bankName: bank.bankName || '',
                    accountNumber: bank.accountNumber || '',
                    ifscCode: bank.ifscCode || '',
                    upiId: bank.upiId || '',
                })
            }
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBankAccount()
    }, [])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!form.bankName || !form.accountNumber || !form.ifscCode || !form.upiId) {
            toast.error('Please fill all fields')
            return
        }

        try {
            setSaving(true)
            const res = await addBankAccount(form)
            toast.success(res?.data?.message || 'Bank account saved')
            setBankData(res?.data?.data || form)
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Something went wrong')
        } finally {
            setSaving(false)
        }
    }
    if (loading) {
        return (
            <div className="flex items-center justify-center py-10 text-slate-500 text-sm">
                Loading...
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6">
            <div className="max-w-md mx-auto p-5 rounded-2xl bg-white border border-slate-200 shadow-md shadow-slate-200/60">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-xs text-slate-500 mb-1 block">Bank Name</label>
                        <input
                            type="text"
                            name="bankName"
                            value={form.bankName}
                            onChange={handleChange}
                            placeholder="e.g. State Bank of India"
                            className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-slate-500 mb-1 block">Account Number</label>
                        <input
                            type="text"
                            name="accountNumber"
                            value={form.accountNumber}
                            onChange={handleChange}
                            placeholder="Enter account number"
                            className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-slate-500 mb-1 block">IFSC Code</label>
                        <input
                            type="text"
                            name="ifscCode"
                            value={form.ifscCode}
                            onChange={handleChange}
                            placeholder="e.g. SBIN0001234"
                            className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 uppercase"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-slate-500 mb-1 block">UPI ID</label>
                        <input
                            type="text"
                            name="upiId"
                            value={form.upiId}
                            onChange={handleChange}
                            placeholder="e.g. username@upi"
                            className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="mt-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : bankData ? 'Update Account' : 'Save Account'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default UserBankAccount