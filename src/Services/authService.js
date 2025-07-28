import axiosInstance from "../utils/axiosInstance";

const apiUrl ='/auth';

// export const login = ({UserDetails}) => axios.post(apiUrl+"/login",UserDetails)
export const login = (requestBody) => axiosInstance.post(apiUrl+"/login",requestBody)

export const signup = (requestBody) => axiosInstance.post(apiUrl+"/register",requestBody)

export const logout = () => axiosInstance.post(apiUrl+"/logout",{})

export const OauthLogin = () => axiosInstance.post(apiUrl)