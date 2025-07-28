import axiosInstance from "../utils/axiosInstance";

const apiurl = '/vote';

export const setVote = (pollOptionId) => axiosInstance.post(apiurl+'/vote',
    {
        pollOptionId: pollOptionId
    }
)

export const updateVote = (voteId,pollOptionId) => axiosInstance.put(apiurl+`/vote/${voteId}`,
    {
        pollOptionId: pollOptionId,
    })


export const deleteVote = (voteId) => axiosInstance.delete(apiurl+`/vote/${voteId}`)



