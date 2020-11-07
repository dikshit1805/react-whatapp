import axios from "axios";

const instance = axios.create ({ 
  baseURL: "https://guarded-refuge-33107.herokuapp.com",
  crossdomain: true,
});

export default instance;