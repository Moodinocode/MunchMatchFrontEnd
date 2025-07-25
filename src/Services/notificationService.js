import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL+'/notification';

export const getNotifications = (token) => axios.get(apiUrl,{
    headers: {
        Authorization: token,
         'ngrok-skip-browser-warning': 'true'
    }
})



export const checkNotifications = (token) => axios.patch(apiUrl,{},{
    headers: {
        Authorization: token,
         'ngrok-skip-browser-warning': 'true'
    }
})