import React, { useEffect, useState } from "react";
import { addBankAccount, getBankAccount } from "../api/user.api";
import toast from "react-hot-toast";
import {
  Building2,
  CreditCard,
  Hash,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from "lucide-react";

const UserBankAccount = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bankData, setBankData] = useState(null);

  const [form, setForm] = useState({
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
  });

  const fetchBankAccount = async () => {
    try {
      setLoading(true);

      const res = await getBankAccount();

      if (res?.success && res?.data) {
        const bank = res.data;

        setBankData(bank);

        setForm({
          bankName: bank.bankName || "",
          accountNumber: bank.accountNumber || "",
          ifscCode: bank.ifscCode || "",
          upiId: bank.upiId || "",
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankAccount();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.bankName ||
      !form.accountNumber ||
      !form.ifscCode ||
      !form.upiId
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setSaving(true);

      const res = await addBankAccount(form);

      toast.success(res?.data?.message || "Bank account saved");

      setBankData(res?.data?.data || form);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-5">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            <Loader2 size={20} className="text-blue-600 animate-spin" />
          </div>

          <p className="text-sm font-medium text-slate-500">
            Loading account details...
          </p>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50/80 border border-slate-200 text-[13px] font-medium text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:py-10">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Building2 size={21} className="text-white" />
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                Bank Account
              </h1>

              <p className="text-xs text-slate-500 mt-0.5">
                Manage your withdrawal account details
              </p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200/80 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
          {/* Top Accent */}
          <div className="h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500" />

          <div className="p-5 md:p-6">
            {/* Account Status */}
            <div className="flex items-center justify-between gap-3 mb-6 p-3.5 rounded-xl bg-blue-50/70 border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm">
                  <ShieldCheck size={18} className="text-blue-600" />
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {bankData
                      ? "Bank Account Connected"
                      : "Add Your Bank Account"}
                  </p>

                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {bankData
                      ? "Your payout details are saved securely"
                      : "Add your details to receive payouts"}
                  </p>
                </div>
              </div>

              {bankData && (
                <CheckCircle2 size={19} className="text-emerald-500 shrink-0" />
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Bank Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Bank Name
                </label>

                <div className="relative">
                  <Building2
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />

                  <input
                    type="text"
                    name="bankName"
                    value={form.bankName}
                    onChange={handleChange}
                    placeholder="e.g. State Bank of India"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Account Number
                </label>

                <div className="relative">
                  <CreditCard
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />

                  <input
                    type="text"
                    name="accountNumber"
                    value={form.accountNumber}
                    onChange={handleChange}
                    placeholder="Enter account number"
                    inputMode="numeric"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* IFSC */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  IFSC Code
                </label>

                <div className="relative">
                  <Hash
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />

                  <input
                    type="text"
                    name="ifscCode"
                    value={form.ifscCode}
                    onChange={handleChange}
                    placeholder="e.g. SBIN0001234"
                    className={`${inputClass} uppercase`}
                  />
                </div>
              </div>

              {/* UPI */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  UPI ID
                </label>

                <div className="relative">
                  <Smartphone
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />

                  <input
                    type="text"
                    name="upiId"
                    value={form.upiId}
                    onChange={handleChange}
                    placeholder="e.g. username@upi"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={saving}
                className="group relative mt-1 w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm font-bold shadow-lg shadow-blue-600/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Saving Account...
                  </>
                ) : (
                  <>
                    {bankData ? "Update Bank Account" : "Save Bank Account"}

                    <ArrowRight
                      size={17}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Security Note */}
            <div className="mt-5 flex items-start gap-2.5 px-1">
              <ShieldCheck
                size={15}
                className="text-blue-500 mt-0.5 shrink-0"
              />

              <p className="text-[10px] leading-4 text-slate-400">
                Make sure your bank and UPI details are correct. Incorrect
                payout information may cause withdrawal delays.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-4 text-center">
          <p className="text-[10px] text-slate-400">
            Your account details are used only for processing payouts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserBankAccount;
