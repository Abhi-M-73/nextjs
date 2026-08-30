import { BarChart2, BookOpen, FileText, LayoutDashboard, Users, Database, PieChart, Activity, Wallet, ChartCandlestick, BanknoteArrowDown, Settings, ClipboardList, Share2, Rocket } from "lucide-react";

import Login from "../screen/auth/Login";
import Register from "../screen/auth/Register";

import UserHistory from "../screen/user/UserHistory";
import UserHome from "../screen/user/UserHome";
import UserProfile from "../screen/user/UserProfile";
import UserTeam from "../screen/user/UserTeam";
import UserWallet from "../screen/user/UserWallet";

import AdminDashboard from "../screen/admin/AdminDashboard";
import AllUsers from "../screen/admin/AllUsers";
import BuyLLD from "../screen/user/BuyLLD";
import DepositHistory from "../screen/admin/DepositHistory";
import AdminControl from "../screen/admin/AdminControl";
import { GrCart } from "react-icons/gr";
import AdminInvestmentHistory from "../screen/admin/AdminInvestmentHistory";
import AdminRoiIncomeHistory from "../screen/admin/AdminRoiIncomeHistory";
import AdminLevelIncomeHistory from "../screen/admin/AdminLevelIncomeHistory";
import AdminReferralIncomeHistory from "../screen/admin/AdminReferralIncomeHistory";
import AdminReactivationCapHistory from "../screen/admin/AdminReactivationCapHistory";
import UserBankAccount from "./UserBankAccount";
import AdminWithdrawalEligibleUsers from "../screen/admin/AdminWithdrawalEligibleUsers";
import AdminWithdrawalRequests from "../screen/admin/AdminWithdrawalRequests";

export const authRoutes = [
    {
        path: "/login",
        element: Login,
    },
    {
        path: "/register",
        element: Register,
    },
];

export const userRoutes = [
    {
        path: "/home",
        element: UserHome,
    },
    {
        path: "/profile",
        element: UserProfile,
    },
    {
        path: "/team",
        element: UserTeam,
    },
    {
        path: "/history",
        element: UserHistory,
    },
    {
        path: "/wallet",
        element: UserWallet,
    },
    {
        path: "/bank-account",
        element: UserBankAccount,
    },
    {
        path: "/buy-lld",
        element: BuyLLD,
    }
];


export const adminRoutes = [
    {
        section: "Main",
        items: [
            { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard", element: AdminDashboard },
            { name: "Users", icon: BarChart2, path: "/users", element: AllUsers },
            { name: "Deposit History", icon: GrCart, path: "/deposit-history", element: AdminInvestmentHistory },
            { name: "ROI Income History", icon: ChartCandlestick, path: "/roi-income-history", element: AdminRoiIncomeHistory },
            { name: "Level Income History", icon: ClipboardList, path: "/level-income-history", element: AdminLevelIncomeHistory },
            { name: "Referral Income History", icon: Share2, path: "/referral-income-history", element: AdminReferralIncomeHistory },
            { name: "Reactivation Cap History", icon: Rocket, path: "/reactivation-cap-history", element: AdminReactivationCapHistory },
            { name: "Withdrawal Eligible Users", icon: Users, path: "/withdrawal-eligible-users", element: AdminWithdrawalEligibleUsers },
            { name: "Withdrawal Requests", icon: BanknoteArrowDown, path: "/withdrawal-requests", element: AdminWithdrawalRequests },
            // { name: "Stake Deposit History", icon: Wallet, path: "/deposit-history", element: DepositHistory },
            { name: "Admin Control", icon: Settings, path: "/admin-control", element: AdminControl },
            // { name: "Invoice", icon: <FileText size={18} />, path: "/admin/invoice" },
            // { name: "CRM", icon: <Users size={18} />, path: "/admin/crm" },
            // { name: "Blog", icon: <BookOpen size={18} />, path: "/admin/blog" },
        ],
    },
];