import axios from "axios";
const baseURL = process.env.VUE_APP_API_URL;

console.log(baseURL);
const repo = axios.create({
  baseURL,
});

export default {
  async getInfo() {
    return repo.get("/");
  },
  async submitForm(obj) {
    return repo.post("/entries", obj);
  },
  async getEntries() {
    return repo.get("/entries");
  },
  async getEntry(uid) {
    return repo.get(`/entries/${uid}`);
  },
};