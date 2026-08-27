import Axios from '../utils/Axios.js';
const API_URL = '/users';

export const userRegister = async (payload) => {
    const response = await Axios.post(`${API_URL}/register`, payload);
    return response;
}

export const getNonce = async (payload) => {
    const response = await Axios.post(`${API_URL}/get-nonce`, payload);
    return response;
}

export const userLogin = async (payload) => {
    const response = await Axios.post(`${API_URL}/login`, payload);
    return response;
}

export const userLogout = async () => {
    const response = await Axios.post(`${API_URL}/logout`);
    return response;
}