import React, { useState } from "react";
import {
  BadgeCheck,
  Calendar,
  CheckCircle2,
  CircleDollarSign,
  Loader2,
  RefreshCw,
  Search,
  User,
  Wallet,
  X,
  XCircle,
} from "lucide-react";
import {
  adminTopupUserWallet,
  searchUserByUsername,
} from "../../api/admin.api";
import toast from "react-hot-toast";

const TOPUP_AMOUNT = 999;

const AdminTopup = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const handleSearch = async () => {
    const searchQuery = query.trim().toLowerCase();

    if (!searchQuery) {
      setSelectedUser(null);
      setResults(null);
      setShowDropdown(false);
      toast.error("Please enter a username");
      return;
    }

    try {
      setSearching(true);
      setSelectedUser(null);
      setResults(null);
      setShowDropdown(false);

      const response = await searchUserByUsername(searchQuery);
      const user = response?.data || null;

      if (!user) {
        toast.error("No user found");
        return;
      }

      // Search button click ke baad direct details show hongi
      setSelectedUser(user);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("User search error:", error);

      setSelectedUser(null);
      setResults(null);
      setShowDropdown(false);

      toast.error(error?.response?.data?.message || "Failed to search user");
    } finally {
      setSearching(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }

    if (event.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setQuery(user?.username || "");
    setResults(null);
    setShowDropdown(false);
  };

  const handleClearUser = () => {
    setSelectedUser(null);
    setQuery("");
    setResults(null);
    setShowDropdown(false);
  };

  const isUserActive = (user) => {
    if (!user?.packageExpiryDate) return false;

    return new Date(user.packageExpiryDate) > new Date();
  };

  // const handleSubmit = async () => {
  //   if (!selectedUser?._id) {
  //     toast.error("Please select a user first");
  //     return;
  //   }

  //   try {
  //     setSubmitting(true);

  //     const response = await adminTopupUserWallet({
  //       userId: selectedUser._id,
  //       username: selectedUser.username,
  //       amount: TOPUP_AMOUNT,
  //     });

  //     if (response?.success !== false) {
  //       toast.success(
  //         response?.message ||
  //           `₹${TOPUP_AMOUNT} added to ${selectedUser.username}'s wallet`,
  //       );

  //       setSelectedUser((previousUser) =>
  //         previousUser
  //           ? {
  //               ...previousUser,
  //               mainWallet: Number(previousUser.mainWallet || 0) + TOPUP_AMOUNT,
  //             }
  //           : previousUser,
  //       );
  //     } else {
  //       toast.error(response?.message || "Failed to topup wallet");
  //     }
  //   } catch (error) {
  //     console.error("Wallet topup error:", error);

  //     toast.error(error?.response?.data?.message || "Failed to topup wallet");
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  const handleSubmit = async () => {
    if (!selectedUser?._id) {
      toast.error("Please select a user first");
      return;
    }

    if (isUserActive(selectedUser)) {
      toast.error("User is already active, topup not allowed");
      return;
    }

    try {
      setSubmitting(true);

      const response = await adminTopupUserWallet({
        userId: selectedUser._id,
        username: selectedUser.username,
        amount: TOPUP_AMOUNT,
      });

      if (response?.success !== false) {
        toast.success(
          response?.message ||
            `₹${TOPUP_AMOUNT} added to ${selectedUser.username}'s wallet`,
        );

        // Topup ke baad form pura reset
        setSelectedUser(null);
        setQuery("");
        setResults(null);
        setShowDropdown(false);
        setLastUpdated(new Date());
      } else {
        toast.error(response?.message || "Failed to topup wallet");
      }
    } catch (error) {
      console.error("Wallet topup error:", error);

      toast.error(error?.response?.data?.message || "Failed to topup wallet");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Top Header */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-xl font-bold text-transparent">
              Wallet Topup
            </h1>
            <p className="text-xs text-slate-500">
              Add balance directly to a user's wallet
            </p>
          </div>

          {lastUpdated && (
            <div className="hidden items-center gap-1.5 text-xs text-slate-500 sm:flex">
              <Calendar className="h-3.5 w-3.5" />
              <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-2xl">
          {/* Topup Amount Card */}
          <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-3 text-white shadow-lg">
                  <CircleDollarSign className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Fixed Topup Amount
                  </p>
                  <h3 className="mt-1 text-2xl font-bold text-slate-900">
                    ₹{"1199"}
                  </h3>
                </div>
              </div>

              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                Admin Credit
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-6 flex items-center gap-2">
              <div className="rounded-lg bg-slate-100 p-1.5 text-slate-600">
                <Search className="h-4 w-4" />
              </div>

              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
                Select User
              </h2>

              <div className="ml-3 h-px flex-1 bg-slate-200" />
            </div>

            {/* Search / Selected User */}
            <div className="relative">
              <label className="mb-1.5 block text-xs font-medium text-slate-500">
                Search by Username
              </label>

              {selectedUser ? (
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100">
                        <User className="h-5 w-5 text-indigo-600" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {selectedUser?.name ||
                            selectedUser?.username ||
                            "Unknown User"}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          @{selectedUser?.username || "unknown"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleClearUser}
                      title="Remove selected user"
                      className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white hover:text-rose-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 border-t border-indigo-100 pt-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-100 bg-white p-3">
                      <p className="text-[11px] text-slate-400">
                        Referral Code
                      </p>
                      <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                        {selectedUser?.referralCode || "—"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-white p-3">
                      <p className="text-[11px] text-slate-400">
                        Wallet Balance
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        ₹
                        {Number(selectedUser?.mainWallet || 0).toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}
                      </p>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3">
                      <span className="text-[11px] text-slate-400">
                        Package Status
                      </span>

                      {isUserActive(selectedUser) ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-600">
                          <BadgeCheck className="h-3.5 w-3.5" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-600">
                          <XCircle className="h-3.5 w-3.5" />
                          Inactive
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3">
                      <span className="text-[11px] text-slate-400">
                        Verification
                      </span>

                      {selectedUser?.isVerified === true ||
                      selectedUser?.isVerified === "true" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                          <BadgeCheck className="h-3.5 w-3.5" />
                          Verified
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-400">
                          Not Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        type="text"
                        value={query}
                        onChange={(event) => {
                          setQuery(event.target.value);
                          setResults(null);
                        }}
                        onKeyDown={handleKeyDown}
                        onFocus={() => {
                          if (query.trim()) {
                            setShowDropdown(true);
                          }
                        }}
                        placeholder="Enter username..."
                        className="
                          w-full rounded-xl border border-slate-200
                          bg-slate-50 py-3 pl-10 pr-3 text-sm
                          text-slate-800 outline-none transition-all
                          placeholder:text-slate-400
                          focus:border-indigo-300 focus:bg-white
                          focus:ring-4 focus:ring-indigo-50
                        "
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleSearch}
                      disabled={searching || !query.trim()}
                      className="
                        flex items-center justify-center gap-2
                        rounded-xl bg-gradient-to-r
                        from-indigo-600 to-purple-600
                        px-5 py-3 text-sm font-semibold text-white
                        shadow-sm transition-all
                        hover:from-indigo-700 hover:to-purple-700
                        active:scale-95 disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {searching ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}

                      <span>Search</span>
                    </button>
                  </div>

                  {/* Search Dropdown */}
                  {showDropdown && (
                    <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                      {searching ? (
                        <div className="flex items-center justify-center gap-2 px-4 py-4 text-sm text-slate-500">
                          <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                          Searching user...
                        </div>
                      ) : !results ? (
                        <div className="px-4 py-4 text-center text-sm text-slate-400">
                          No user found
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSelectUser(results)}
                          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-indigo-50"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100">
                              <User className="h-4 w-4 text-indigo-600" />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-800">
                                {results?.name ||
                                  results?.username ||
                                  "Unknown User"}
                              </p>
                              <p className="truncate text-xs text-slate-500">
                                @{results?.username || "unknown"}
                              </p>
                            </div>
                          </div>

                          {isUserActive(results) ? (
                            <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-600">
                              Active
                            </span>
                          ) : (
                            <span className="shrink-0 rounded-full bg-rose-50 px-2 py-1 text-[10px] font-semibold text-rose-600">
                              Inactive
                            </span>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Topup Summary */}
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-400">
                    Amount to be credited
                  </p>
                  <p className="mt-1 text-lg font-bold text-slate-900">
                    ₹{"1199"}
                  </p>
                </div>

                <Wallet className="h-6 w-6 text-indigo-500" />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                !selectedUser || submitting || isUserActive(selectedUser)
              }
              className="
                mt-5 flex w-full items-center justify-center gap-2
                rounded-xl bg-gradient-to-r from-indigo-600
                via-purple-600 to-pink-600 py-3.5
                text-sm font-semibold text-white shadow-md
                transition-all hover:shadow-lg active:scale-[0.99]
                disabled:cursor-not-allowed disabled:opacity-50
              "
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing Topup...
                </>
              ) : isUserActive(selectedUser) ? (
                <>
                  <XCircle className="h-4 w-4" />
                  User Already Active
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Topup ₹{TOPUP_AMOUNT.toLocaleString("en-IN")}
                </>
              )}
            </button>

            <p className="mt-3 text-center text-xs text-slate-400">
              Please verify the selected username before submitting.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mx-auto mt-8 max-w-2xl border-t border-slate-200 pt-6">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span>Wallet topup system operational</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminTopup;
