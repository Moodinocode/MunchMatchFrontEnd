import axiosInstance from "../utils/axiosInstance";

const apiUrl = '/user';

export const getAllUsers = () => axiosInstance.get(apiUrl)


export const signup = (UserDetails) => axiosInstance.post(apiUrl+"/register",UserDetails)

export const logout = () => axiosInstance.post(apiUrl+"/logout",{})

export const OauthLogin = () => axios.post(apiUrl)