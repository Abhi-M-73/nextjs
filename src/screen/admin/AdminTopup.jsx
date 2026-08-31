import React, { useState, useRef } from 'react'
import { adminTopupUserWallet, searchUserByUsername } from '../../api/admin.api';
import { Search, Wallet, User, Loader2, CheckCircle2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminTopup = () => {
  const [query, setQuery] = useState("");
const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const wrapperRef = useRef(null);

 const handleSearch = async () => {
  if (!query.trim()) {
    setResults(null);
    setShowDropdown(false);
    return;
  }

  try {
    setSearching(true);

    const res = await searchUserByUsername(
      query.trim().toLowerCase()
    );

    const user = res?.data || null;

    setResults(user);
    setShowDropdown(true);

    if (!user) {
      toast.error("No user found");
    }
  } catch (error) {
    console.error(error);
    setResults(null);
    setShowDropdown(true);

    toast.error(
      error?.response?.data?.message || "Failed to search user"
    );
  } finally {
    setSearching(false);
  }
};

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setQuery(user?.username || "");
    setShowDropdown(false);
  };

 const handleClearUser = () => {
  setSelectedUser(null);
  setQuery("");
  setResults(null);
  setAmount("");
  setRemark("");
  setShowDropdown(false);
};

  const handleSubmit = async () => {
    if (!selectedUser?._id) {
      return toast.error("Please select a user first");
    }
    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      return toast.error("Please enter a valid amount");
    }

    try {
      setSubmitting(true);
      const res = await adminTopupUserWallet({
        userId: selectedUser._id,
        username: selectedUser.username,
        amount: numAmount,
        remark: remark.trim(),
      });

      if (res?.success !== false) {
        toast.success(res?.message || `₹${numAmount.toFixed(2)} added to ${selectedUser.username}'s wallet`);
        setAmount("");
        setRemark("");
      } else {
        toast.error(res?.message || "Failed to topup wallet");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to topup wallet");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-5">
      <div className="mb-6">
        <h2 className="text-slate-900 text-xl font-semibold flex items-center gap-2">
          <Wallet size={20} className="text-blue-600" />
          Wallet Topup
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Search a user by username and add balance directly to their wallet.
        </p>
      </div>

      <div className="bg-black border border-slate-200 shadow-sm rounded-2xl p-5 space-y-5">

        {/* Search / Selected user */}
        <div ref={wrapperRef} className="relative">
          <label className="text-slate-500 text-xs mb-1.5 block">Search User</label>

          {selectedUser ? (
            <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <User size={16} className="text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-slate-900 text-sm font-medium truncate">{selectedUser?.username}</p>
                  <p className="text-slate-500 text-xs truncate">{selectedUser?.name || selectedUser?.email || "-"}</p>
                </div>
              </div>
              <button
                onClick={handleClearUser}
                className="p-1.5 rounded-md hover:bg-white text-slate-400 hover:text-red-500 transition shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Enter username..."
                    className="w-full bg-white border border-slate-300 text-slate-900 text-sm pl-9 pr-3 py-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={searching || !query.trim()}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  {searching ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Search size={15} />
                  )}
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>

             {showDropdown && (
  <div className="absolute z-20 mt-1.5 w-full bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden">
    {searching ? (
      <p className="text-slate-400 text-sm px-3 py-3 text-center">
        Searching...
      </p>
    ) : !results ? (
      <p className="text-slate-400 text-sm px-3 py-3 text-center">
        No user found
      </p>
    ) : (
      <button
        type="button"
        onClick={() => handleSelectUser(results)}
        className="w-full flex items-center gap-2.5 px-3 py-3 hover:bg-blue-50 transition text-left"
      >
        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <User size={15} className="text-blue-600" />
        </div>

        <div className="min-w-0">
          <p className="text-slate-900 text-sm font-medium truncate">
            {results?.username}
          </p>

          <p className="text-slate-500 text-xs truncate">
            {results?.email || "-"}
          </p>
        </div>
      </button>
    )}
  </div>
)}
            </div>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="text-slate-500 text-xs mb-1.5 block">Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="1"
            step="0.01"
            disabled={!selectedUser}
            className="w-full bg-white border border-slate-300 text-slate-900 text-sm px-3 py-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50"
          />
        </div>

        
        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!selectedUser || submitting}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Processing...
            </>
          ) : (
            <>
              <CheckCircle2 size={16} /> Topup Wallet
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AdminTopup