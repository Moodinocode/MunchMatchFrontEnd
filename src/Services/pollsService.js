import axiosInstance from "../utils/axiosInstance";
const apiurl = '/poll';


export const getPolls = ()=> axiosInstance.get(apiurl)

export const createPoll = (poll) => axiosInstance.post(apiurl, poll)

export const isAuther = (pollId) => axiosInstance.get(apiurl+`/${pollId}/iscreator`)

export const deactivatePoll = (pollId) => axiosInstance.patch(apiurl+`/${pollId}/deactivate`,{})
