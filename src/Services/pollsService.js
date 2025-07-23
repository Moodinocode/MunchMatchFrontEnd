import axios from "axios"
const apiurl = import.meta.env.VITE_API_URL+'/poll';


export const getPolls = (token)=> axios.get(apiurl,{
    headers: {
        Authorization: token,
        'ngrok-skip-browser-warning': 'true'
    }
})

export const createPoll = (poll,token) => axios.post(apiurl, poll, {
    headers: {
        Authorization: token
    }
})

export const isAuther = (pollId,token) => axios.get(apiurl+`/${pollId}/iscreator`,{
    headers: {
        Authorization: token
    }
})

export const deactivatePoll = (pollId,token) => axios.patch(apiurl+`/${pollId}/deactivate`,{},{
    headers: {
        Authorization: token,
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
    }
})
