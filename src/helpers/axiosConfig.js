import axios from "axios";
import galleta from "js-cookie"

const Axios = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})
Axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    if (galleta.getJSON('user') !== undefined){
        const token = galleta.getJSON('user').user.token;
        config.headers["x-access-token"] = token;
    }

    return config;
});
export default Axios