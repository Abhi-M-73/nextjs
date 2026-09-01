import Axios from "../utils/Axios.js";

const API_URL = "/admin";

export const adminLogin = async (payload) => {
  const response = await Axios.post(`${API_URL}/login`, payload);
  return response;
};

export const getAllUserList = async () => {
  const response = await Axios.get(`${API_URL}/getAllUsers`);
  return response;
};

export const getDashbboardData = async () => {
  const response = Axios.get(`${API_URL}/getAllIncomes`);
  return response;
};
export const getDepositHistory = async () => {
  const response = Axios.get(`${API_URL}/get-deposit-history`);
  return response;
};
export const getRoiIncomeHistory = async () => {
  const response = Axios.get(`${API_URL}/get-roi-history`);
  return response;
};
export const getReferralIncomeHistory = async () => {
  const response = Axios.get(`${API_URL}/get-referalBonus-history`);
  return response;
};

export const getLevelIncomeHistory = async () => {
  const response = Axios.get(`${API_URL}/getAllLevelIncome-history`);
  return response;
};

export const getWithdrawalHistory = async () => {
  const response = Axios.get(`${API_URL}/withdrawals`);
  return response;
};

export const approveWithdrawReq = async (id) => {
  const response = Axios.post(`${API_URL}/withdrawal/${id}/approve`, {});
  return response;
};

export const rejectWithdrawReq = async (payload) => {
  const response = Axios.post(
    `${API_URL}/withdrawal/${payload.id}/reject`,
    payload,
  );
  return response;
};

export const changePrivateKey = async (payload) => {
  const response = await Axios.post(`${API_URL}/change-private-key`, payload);
  return response;
};

export const changeWalletAddress = async (payload) => {
  const response = await Axios.post(`${API_URL}/change-stake-address`, payload);
  return response;
};

export const viewCredentials = async () => {
  const response = await Axios.get(`${API_URL}/view-credentials`);
  return response;
};

export const getAdminDepositHistory = async () => {
  const response = Axios.get(`${API_URL}/get-all-deposits`);
  return response;
};

export const rejectDeposit = async (payload) => {
  const response = await Axios.post(`${API_URL}/reject-deposit`, payload);
  return response;
};

export const approveDeposit = async (payload) => {
  const response = await Axios.post(`${API_URL}/approve-deposit`, payload);
  return response;
};

export const getQr = async () => {
  const response = Axios.get(`${API_URL}/get-qr`);
  return response;
};

export const uploadQr = async (payload) => {
  const response = await Axios.post(`${API_URL}/upload-qr`, payload);
  return response;
};

export const getAdminReactivationCapHistory = async () => {
  const response = Axios.get(`${API_URL}/get-reactivation-cap-deduct-history`);
  return response;
};

export const getWithdrawalEligibleUsers = async () => {
  const response = Axios.get(`${API_URL}/high-wallet`);
  return response;
};

export const adminTopupUserWallet = async (payload) => {
  const response = await Axios.post(`${API_URL}/admin-topup`, payload);
  return response;
};

export const searchUserByUsername = async (userName) => {
  const response = await Axios.post(`${API_URL}/get-info`, { userName });
  return response;
};

export const toggleUserBlock = async (userId) => {
  const response = await Axios.post(`${API_URL}/user-block/${userId}`);
  return response;
};

export const adminChangeUserPassword = async ({ userId, newPassword }) => {
  const response = await Axios.post(`${API_URL}/change-password/${userId}`, {
    newPassword,
  });
  return response;
};

export const adminApproveWithdrawal = async (userId) => {
  const response = await Axios.post(`${API_URL}/admin/withdrawal/approve`, {
    userId,
  });
  return response;
};

export const adminRejectWithdrawal = async (userId) => {
  const response = await Axios.post(`${API_URL}/admin/withdrawal/reject`, {
    userId,
  });
  return response;
};

export const adminApproveAllWithdrawals = async (userIds) => {
  const response = await Axios.post(`${API_URL}/admin/withdrawal/approve-all`, {
    userIds,
  });
  return response;
};

export const adminRejectAllWithdrawals = async (userIds) => {
  const response = await Axios.post(`${API_URL}/admin/withdrawal/reject-all`, {
    userIds,
  });
  return response;
};
