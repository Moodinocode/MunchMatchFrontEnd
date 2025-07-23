import axios from "axios"

const apiurl = import.meta.env.VITE_API_URL+'/vote';

export const setVote = (token,pollOptionId) => axios.post(apiurl+'/vote',
    {
        pollOptionId: pollOptionId
    }
    ,
   {
    headers: {
        Authorization: token
    }
   }
)

export const updateVote = (token,voteId,pollOptionId) => axios.put(apiurl+`/vote/${voteId}`,
    {
        pollOptionId: pollOptionId,
    }
    ,
   {
    headers: {
        Authorization: token
    }
   }
)


export const deleteVote = (token,voteId) => axios.delete(apiurl+`/vote/${voteId}`,
   {
    headers: {
        Authorization: token
    }
   }
)



