import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL+'/option';

export const getOptions = (token) => axios.get(apiUrl,{
    headers: {
        Authorization: token,
         'ngrok-skip-browser-warning': 'true'
    }
})

export const createOption = (token,option) => axios.post(apiUrl,option,
    {
        headers: {
            Authorization: token
        }
    }
)

export const updateOption = (token,option,id) => axios.put(apiUrl+`/${id}`,
    {
         option
    },
    {
        headers: {
            Authorization: token
        }
    }
)

export const deleteOption = (token,optionId) => axios.post(apiUrl+`/${optionId}`,
    {
        headers: {
            Authorization: token
        }
    }
)


