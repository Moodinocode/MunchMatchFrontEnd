import axiosInstance from "../utils/axiosInstance";

const apiUrl ='/notification';

export const getNotifications = () => axiosInstance.get(apiUrl)

export const checkNotifications = () => axiosInstance.patch(apiUrl,{})