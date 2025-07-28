import {create} from 'zustand'
import { getNotifications } from '../Services/notificationService';
import { ToastContainer, toast } from 'react-toastify';

const useNotificationStore = create((set, get) => ({
    notifications: [],
    loading: true,
    error: null,

    fetchNotifications: async (token) => {
        try {
            const res = await getNotifications(token);
            const sortedNotifications = res.data.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            set({notifications: sortedNotifications, loading: false})
        } catch (err) {
            console.log("error fetching polls:", err)
            set({error: err.message, loading: false});
        }
    },
    addNotification: (notification) =>
        set((state) => {
            const updated = [...state.notifications, notification].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            //notify();
            return { notifications: updated };
        }),
    checkedNotifications: () =>
        set((state) => {
            console.log("inside")
            const updated = state.notifications.map(not => ({
            ...not,
            checked: true,
            }));

            return { notifications: updated };
        }),

}));

export default useNotificationStore;