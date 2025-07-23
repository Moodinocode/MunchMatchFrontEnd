import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL+'/user';

export const getAllUsers = (token) => axios.get(apiUrl,
    {
        headers: {
            Authorization: token,
            'ngrok-skip-browser-warning': 'true'
        }
    }
    
)


export const signup = (UserDetails) => axios.post(apiUrl+"/register",UserDetails)

export const logout = (token) => axios.post(apiUrl+"/logout",{},{
    headers: {
        Authorization: token
    }
})

export const OauthLogin = () => axios.post(apiUrl)