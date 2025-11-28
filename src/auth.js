export const auth = {
  get isAuthenticated() {
    return localStorage.getItem("isAuthenticated") === "true";
  },
  set isAuthenticated(value) {
    if (value) {
      localStorage.setItem("isAuthenticated", "true");
    } else {
      localStorage.removeItem("isAuthenticated");
    }
  },
  login() {
    this.isAuthenticated = true;
  },
  logout() {
    this.isAuthenticated = false;
  },
};
