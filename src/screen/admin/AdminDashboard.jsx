import { Banknote, CreditCard, DollarSign, Users } from "lucide-react";
import { useState } from "react";
import AdminStatCard from "../../components/admin/AdminStatCard";
import { getDashbboardData } from "../../api/admin.api";
import { useEffect } from "react";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const fetchAllUser = async () => {
    try {
      setLoading(true);
      const res = await getDashbboardData();

      if (res?.success) {
        setData(res?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllUser();
  }, []);


  const normalizeDashboardData = (data) => {
    if (!data) return {};

    return {
      totalUsers: data.users?.total || 0,
      todayUsers: data.users?.todayUsers || 0,
      activeUsers: data.users?.active || 0,
      inactiveUsers: data.users?.inactive || 0,

      totalInvestment: data.investment?.totalStakedAmount || 0,
      todayInvestment: data.investment?.todayStakedAmount || 0,



      totalRoi: data.roiIncome?.total || 0,
      todayRoi: data.roiIncome?.today || 0,

      totalWithdraw: data.withdrawal?.totalAmount || 0,
      todayWithdraw: data.withdrawal?.todayAmount || 0,


    };
  };



  const dashboard = normalizeDashboardData(data);


  const cards = [
    {
      title: "Total Investment",
      value: "$0",
      icon: <CreditCard />,
      trend: "up",
    },
    {
      title: "Total Users",
      value: "$0",
      icon: <Users className="text-pink-500" />,
      trend: "down",
    },
    {
      title: "Total Income",
      value: "$0",
      icon: <Banknote className="text-cyan-500" />,
    },
  ];

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-[#020d12] via-[#03151c] to-black min-h-screen text-white">

      {/* Top Cards */}
      <div className="grid md:grid-cols-3 gap-5 mb-6">

        {/* ─── USERS ───────────────────────── */}
        <AdminStatCard
          title="Total Users"
          value={dashboard.totalUsers}
          trend="up"
          icon={<Users />}
          iconColor="from-purple-500 to-indigo-400"
        />
        <AdminStatCard
          title="Today Users"
          value={dashboard.todayUsers}
          trend="up"
          icon={<Users />}
          iconColor="from-purple-500 to-indigo-400"
        />

        <AdminStatCard
          title="Active Users"
          value={dashboard.activeUsers}
          trend="up"
          icon={<Users />}
          iconColor="from-green-500 to-emerald-400"
        />

        <AdminStatCard
          title="Inactive Users"
          value={dashboard.inactiveUsers}
          trend="down"
          icon={<Users />}
          iconColor="from-gray-500 to-gray-400"
        />

        {/* ─── INVESTMENT ───────────────────── */}
        <AdminStatCard
          title="Total Investment"
          value={dashboard.totalInvestment}
          unit="$"
          trend="up"
          icon={<CreditCard />}
          iconColor="from-yellow-500 to-yellow-400"
        />

        <AdminStatCard
          title="Today Investment"
          value={dashboard.todayInvestment}
          unit="$"
          trend={dashboard.todayInvestment > 0 ? "up" : "down"}
          icon={<CreditCard />}
          iconColor="from-orange-500 to-amber-400"
        />

        {/* ─── STAKING ───────────────────── */}
        <AdminStatCard
          title="Total Staking Income"
          value={dashboard.totalRoi}
          unit="$"
          trend="up"
          icon={<Banknote />}
          iconColor="from-blue-500 to-cyan-400"
        />

        <AdminStatCard
          title="Today Staking Income"
          value={dashboard.todayRoi}
          unit="$"
          trend={dashboard.todayStake > 0 ? "up" : "down"}
          icon={<Banknote />}
          iconColor="from-sky-500 to-blue-400"
        />




        {/* ─── WITHDRAWALS ───────────────── */}
        <AdminStatCard
          title="Total Withdrawals"
          value={dashboard.totalWithdraw}
          unit="$"
          trend="down"
          icon={<Banknote />}
          iconColor="from-red-500 to-rose-400"
        />

        <AdminStatCard
          title="Today Withdrawals"
          value={dashboard.todayWithdraw}
          unit="$"
          trend={dashboard.todayWithdraw > 0 ? "up" : "down"}
          icon={<Banknote />}
          iconColor="from-pink-500 to-rose-300"
        />



      </div>



      {/* Middle Section */}
      <div className="grid md:grid-cols-3 gap-5">

        {/* Chart */}
        {/* <div className="md:col-span-2 bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-lg">

          <div className="flex justify-between items-center mb-5">
            <div>
              <p className="text-gray-400 text-sm">Total Growth</p>
              <h2 className="text-2xl font-bold">$2,324.00</h2>
            </div>
          </div>

          <div className="h-64 flex items-end gap-2">
            {[40, 80, 60, 100, 70, 90, 50, 120, 60, 110].map((h, i) => (
              <div
                key={i}
                className="w-full bg-gradient-to-t from-[var(--primary-color)] to-[var(--primary-color)]/10 rounded-md transition-all duration-300 hover:scale-105"
                style={{ height: `${h}%` }}
              ></div>
            ))}
          </div>
        </div> */}

        {/* Right Panel */}
        {/* <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-lg">

          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">Popular Stocks</h2>
            <span className="opacity-60">•••</span>
          </div>

          {[
            { name: "Bajaj Finery", price: "$1839.00", status: "profit" },
            { name: "TTML", price: "$100.00", status: "loss" },
            { name: "Reliance", price: "$200.00", status: "profit" },
          ].map((stock, i) => (
            <div
              key={i}
              className="flex justify-between items-center py-3 border-b border-white/10 hover:bg-white/5 px-2 rounded-lg transition"
            >
              <div>
                <p className="text-sm font-medium">{stock.name}</p>
                <p
                  className={`text-xs ${stock.status === "profit"
                    ? "text-green-400"
                    : "text-red-400"
                    }`}
                >
                  {stock.status === "profit" ? "10% Profit" : "10% Loss"}
                </p>
              </div>

              <p className="text-sm font-semibold">{stock.price}</p>
            </div>
          ))}
        </div> */}
      </div>

      {/* Bottom Section */}
      <div className="grid md:grid-cols-2 gap-5 mt-6">

        {/* Donut */}
        {/* <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-lg text-center">
          <h2 className="mb-4 font-semibold">Current Download</h2>

          <div className="w-40 h-40 mx-auto rounded-full border-[18px] border-[var(--primary-color)] flex items-center justify-center shadow-inner">
            <span className="text-lg font-semibold">188,245</span>
          </div>
        </div> */}

        {/* Stats */}
        {/* <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-lg">
          <h2 className="mb-4 font-semibold">Area Installed</h2>

          <div className="space-y-4">
            {[
              { name: "Asia", value: "1.23k" },
              { name: "Europe", value: "6.79k" },
              { name: "America", value: "1.01k" },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.name}</span>
                  <span>{item.value}</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full">
                  <div className="h-2 bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-color)]/20 rounded-full w-[70%]" />
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default AdminDashboard;