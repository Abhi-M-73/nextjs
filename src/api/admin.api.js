import Axios from '../utils/Axios.js';

const API_URL = '/admin';

export const adminLogin = async (payload) => {
    const response = await Axios.post(`${API_URL}/login`, payload);
    return response;
}


export const getAllUserList = async () => {
    const response = await Axios.get(`${API_URL}/getAllUsers`);
    return response;
}

export const getDashbboardData = async () => {
  const response = Axios.get(`${API_URL}/getAllIncomes`);
  return response;
};
export const getDepositHistory = async () => {
  const response = Axios.get(`${API_URL}/get-deposit-history`);
  return response;
};
export const getStakeIncomeHistory = async () => {
  const response = Axios.get(`${API_URL}/get-stake-income-history`);
  return response;
};
export const getWithdrawalHistory = async () => {
  const response = Axios.get(`${API_URL}/get-withdrawal-history`);
  return response;
};


export const changePrivateKey = async (payload) => {
  const response = await Axios.post(`${API_URL}/change-private-key`, payload);
  return response;
}

export const changeWalletAddress = async (payload) => {
  const response = await Axios.post(`${API_URL}/change-stake-address`, payload);
  return response;
}

export const viewCredentials = async () => {
  const response = await Axios.get(`${API_URL}/view-credentials`);
  return response;
}

export const getAdminDepositHistory = async () => {
  const response = Axios.get(`${API_URL}/get-all-deposits`);
  return response;
}

export const rejectDeposit = async (payload) => {
  const response = await Axios.post(`${API_URL}/reject-deposit`, payload);
  return response;
}

export const approveDeposit = async (payload) => {
  const response = await Axios.post(`${API_URL}/approve-deposit`, payload);
  return response;
}


export const getQr = async () => {
  const response = Axios.get(`${API_URL}/get-qr`);
  return response;
}


export const uploadQr = async (payload) => {
  const response = await Axios.post(`${API_URL}/upload-qr`, payload);
  return response;
}


