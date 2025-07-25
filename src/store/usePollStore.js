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
            // Check if this poll contains the option we're updating
            const hasOption = poll.options.some(o => o.id === pollOptionId);
            if (!hasOption) return poll;

            const newOptions = poll.options.map(option => {
                // Handle the option being voted on
                if (option.id === pollOptionId) {
                    let voters = [...option.voters];
                    
                    if (voteAction === "add") {
                        // Add vote if user hasn't voted on this option
                        if (!voters.some(v => v.id === userId)) {
                            voters.push({ id: userId, name: "You" });
                        }
                    } else if (voteAction === "remove") {
                        // Remove vote from this option
                        voters = voters.filter(v => v.id !== userId);
                    } else if (voteAction === "update") {
                        // Add vote to this option (for single-choice polls)
                        if (!voters.some(v => v.id === userId)) {
                            voters.push({ id: userId, name: "You" });
                        }
                    }
                    
                    return { ...option, voters };
                }
                
                // For update action, remove vote from previous option
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
    }
}))

export default usePollStore;