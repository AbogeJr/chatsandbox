import { create } from "zustand";
import { useUserStore } from "./userStore";

interface Store {
  chatId: any;
  user: any;
  isCurrentUserBlocked: boolean;
  isReceiverBlocked: boolean;
  showDetails: boolean;
  changeChat: (chatId: any, user: any) => any;
  changeBlock: () => any;
  resetChat: () => any;
  toggleDetails: () => any;
}

export const useChatStore = create<Store>((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
  showDetails: false,
  changeChat: (chatId: any, user: any) => {
    const currentUser = useUserStore.getState().currentUser;

    // CHECK IF CURRENT USER IS BLOCKED
    if (user.blocked.includes(currentUser.id)) {
      return set({
        chatId,
        user: null,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      });
    }

    // CHECK IF RECEIVER IS BLOCKED
    else if (currentUser.blocked.includes(user.id)) {
      return set({
        chatId,
        user: user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      });
    } else {
      return set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: false,
      });
    }
  },

  changeBlock: () => {
    set((state: any) => ({
      ...state,
      isReceiverBlocked: !state.isReceiverBlocked,
    }));
  },
  resetChat: () => {
    set({
      chatId: null,
      user: null,
      isCurrentUserBlocked: false,
      isReceiverBlocked: false,
    });
  },

  toggleDetails: () => {
    set((state: any) => ({ ...state, showDetails: !state.showDetails }));
  },
}));
