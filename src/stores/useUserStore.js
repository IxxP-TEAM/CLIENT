import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    checkInStatus: null,
  }),
  actions: {
    setUsers(users) {
      this.users = users;
    },
    setCheckInStatus(status) {
      this.checkInStatus = status;
    },
  },
});