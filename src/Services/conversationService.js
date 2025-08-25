
import axiosInstance from "../utils/axiosInstance";

const apiUrl ='/conversation';

export const listParticipants = (sid) => axiosInstance.get(apiUrl+"/list_participants?sid="+sid);

export const getConversations = () => axiosInstance.get(`${apiUrl}/my_conversations`);

export const createConversation = (conversationName,participants) => axiosInstance.post(apiUrl+"/create",{conversationName, participants});

export const addParticipant = (sid, participant) => axiosInstance.post(`${apiUrl}/add_participant`, {participant, sid});

export const removeParticipant = (sid, participant) => axiosInstance.delete(`${apiUrl}/remove_participant`, { participant, sid});