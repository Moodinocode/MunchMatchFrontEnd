import axiosInstance from "../utils/axiosInstance";

const apiUrl = '/user';

export const getAllUsers = () => axiosInstance.get(apiUrl)

export const updateUser = (requestBody) => axiosInstance.put(apiUrl,requestBody)