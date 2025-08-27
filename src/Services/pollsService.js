import axiosInstance from "../utils/axiosInstance";
const apiurl = '/poll';


export const getPolls = (onlyActive,page)=> axiosInstance.get(apiurl+`?page=${page}&active=${onlyActive}`)

export const createPoll = (poll) => axiosInstance.post(apiurl, poll)

export const isAuther = (pollId) => axiosInstance.get(apiurl+`/${pollId}/iscreator`)

export const deactivatePoll = (pollId) => axiosInstance.patch(apiurl+`/${pollId}/deactivate`,{})
