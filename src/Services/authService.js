import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL+'/auth';



// export const login = ({UserDetails}) => axios.post(apiUrl+"/login",UserDetails)
export const login = (UserDetails) => axios.post(apiUrl+"/login",UserDetails)

export const signup = (UserDetails) => axios.post(apiUrl+"/register",UserDetails)

export const logout = (token) => axios.post(apiUrl+"/logout",{},{
    headers: {
        Authorization: token
    }
})

export const OauthLogin = () => axios.post(apiUrl)