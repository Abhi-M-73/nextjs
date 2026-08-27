import Axios from "../utils/Axios.js";

const API_URL = "/users";


export const getUserInfo = async () => {
  const response = await Axios.get(`${API_URL}/get-profile`);
  return response;
}

export const getLevelWiseTeam = async () => {
  const response = await Axios.get(`${API_URL}/get-level-team`);
  return response;
};

export const getLldHistory = async ({ page = 1, limit = 10 } = {}) => {
  const response = await Axios.get(`${API_URL}/get-buy-lld-history`, {
    params: { page, limit },
    withCredentials: true, 
  });
  return response;
};


export const getRoiIncomeHistory = async () => {
  const response = Axios.get(`${API_URL}/get-roi-income`);
  return response;
};

export const getReferralIncomeHistory = async () => {
  const response = Axios.get(`${API_URL}/get-referral-income`);
  return response;
};

export const getLevelIncomeHistory = async () => {
  const response = Axios.get(`${API_URL}/get-level-income`);
  return response;
};

export const getDepositHistory = async () => {
  const response = Axios.get(`${API_URL}/get-deposit-history`);
  return response;
};


export const stakeDepositLLD = async (payload) => {
  const response = await Axios.post(`${API_URL}/stake-lld`, payload);
  return response;
};


export const withdrawRequest = async (payload) => {
  const response = await Axios.post(
    `${API_URL}/withdrawal-request`,
    payload,
    { timeout: 120000 } // ⬅️ 2 minutes — blockchain confirmation ke liye
  );
  return response;
};

export const getWithdrawalHistory = async () => {
  const response = await Axios.get(`${API_URL}/get-withdrawal-history`);
  return response;
};

export const buyLLD = async (payload) => {
  const response = await Axios.post(`${API_URL}/buy-lld`, payload);
  return response
}


export const unStakeDeposit = async (payload) => {
  const response = await Axios.post(`${API_URL}/un-stake`, payload);
  return response
}


export const getQr = async () => {
  const response = Axios.get(`${API_URL}/get-qr`);
  return response;
}


export const submitDeposit = async (payload) => {
  const response = await Axios.post(`${API_URL}/make-investment`, payload);
  return response;
}