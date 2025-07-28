import axiosInstance from "../utils/axiosInstance";

const apiUrl = '/option';

export const getOptions = () => axiosInstance.get(apiUrl)

export const createOption = (requestBody) => axiosInstance.post(apiUrl,requestBody
)

export const updateOption = (requestBody,id) => axiosInstance.put(apiUrl+`/${id}`,
    {
        requestBody
    }
)
export const deleteOption = (token,optionId) => axiosInstance.post(apiUrl+`/${optionId}`
)


