import axios from "axios";
const baseURL = process.env.VUE_APP_API_URL;

console.log(baseURL);
const repo = axios.create({
  baseURL,
});

export default {
  async submitForm(obj) {
    return repo.post("/", obj);
  }
};