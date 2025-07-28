import {create} from 'zustand'
import { getPolls } from '../Services/pollsService';

const usePollStore = create((set, get) => ({
    polls: [],
    loading: false,
    error: null,

    fetchPolls: async (token) => {
        set({loading: true, error: null});

        try {
            const res = await getPolls(token);
            set({polls: res.data.content, loading: false})
        } catch (err) {
            console.log("error fetching polls:", err)
            set({error: err.message, loading: false});
        }
    },
    
    updateVote: ({userId, pollOptionId, voteAction, previousOptionId}) => {
        const { polls } = get(); // Get current state
        
        const updatedPolls = polls.map(poll => {
            
            const hasOption = poll.options.some(o => o.id === pollOptionId);
            if (!hasOption) return poll;

            const newOptions = poll.options.map(option => {
               
                if (option.id === pollOptionId) {
                    let voters = [...option.voters];
                    
                    if (voteAction === "add") {
                        
                        if (!voters.some(v => v.id === userId)) {
                            voters.push({ id: userId, name: "You" });
                        }
                    } else if (voteAction === "remove") {
                       voters = voters.filter(v => v.id !== userId);
                    } else if (voteAction === "update") {
                        
                        if (!voters.some(v => v.id === userId)) {
                            voters.push({ id: userId, name: "You" });
                        }
                    }
                    
                    return { ...option, voters };
                }
                
            
                if (voteAction === "update" && previousOptionId && option.id === previousOptionId) {
                    return {
                        ...option,
                        voters: option.voters.filter(v => v.id !== userId),
                    };
                }
                
                return option;
            });

            return { ...poll, options: newOptions };
        });

        set({ polls: updatedPolls });
    },

    handleVoteChange: (data) => {
        const { polls } = get();
        try {
            const updatedPolls = polls.map(poll =>
                poll.id === data.id ? { ...poll, ...data } : poll
            );

            set({polls: updatedPolls})
        } catch (error) {
            console.error('Error handling WebSocket message:', error);
        }
    },

    addPoll: (newPoll) => {
        const { polls } = get();
        set({ polls: [newPoll, ...polls] });
    },
}))

export default usePollStore;