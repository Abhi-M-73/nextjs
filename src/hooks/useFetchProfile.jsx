import React from 'react'
import { useDispatch } from 'react-redux'
import { getUserInfo } from '../api/user.api';
import { setUser } from '../redux/slices/authSlice';

const useFetchProfile = () => {
    const dispatch = useDispatch();

    const fetchUserInfo = async () => {
        try {
            const response = await getUserInfo();
            if (response?.success) {
                dispatch(setUser(response?.user));
            }
        } catch (error) {
            console.log(error);
        }
    };

    return { fetchUserInfo }
}

export default useFetchProfile
