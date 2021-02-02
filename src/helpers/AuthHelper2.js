import Axios from 'axios';

let inMemoryToken;
let names;

const TOKEN = "tdrToken";
export const loginURL = process.env.REACT_APP_API_URL + 'session/login';
const refreshURL = process.env.REACT_APP_API_URL + 'session';
const verifyURL = process.env.REACT_APP_API_URL + 'session/verify';

export const getNames = () => names;
export const setNames = (Names) => { names = Names; }
export const getToken = () => inMemoryToken;
export const setToken = (token) => { inMemoryToken = token; }
export const getRefreshToken = () => localStorage.getItem(TOKEN);
export const setRefreshToken = (refreshToken) => { localStorage.setItem(TOKEN, refreshToken); }
export const deleteTokens = () => {
    inMemoryToken = null; 
    localStorage.removeItem(TOKEN);
    names = null;
}
export const refreshToken = () => {
    Axios.post(refreshURL, {
        token: getToken(),
        refreshToken: getRefreshToken(),
        names: getNames()
    }).then(res => { if (!res.data.error) { setTokens(res) } });
}
export const setTokens = (res) => {
    setToken(res.data.result.token);
    setRefreshToken(res.data.result.refreshToken);
    setNames(res.data.result.names);
}
export const verify = reqRole => {
    let token = getToken();
    let error = false;
    let role = "";
    if (!token) {
        error = true;
    } else {
        Axios.post(verifyURL, {
            token: token
        }).then(res => {
            if (res.data.error) {
                error = true;
            } else {
                role = res.data.result.role;
            }
        });
    }
    if (error) {
        alert("Por favor, inicie sesión para continuar.\n" +
                "Si ya inició sesión, ingrese nuevamente.");
        return 401;
    } else {
        if (role === reqRole) {
            alert("Ud. no tiene permiso para acceder a este contenido.");
        }
        return (role === reqRole) ? 200 : 403;
    }
}
export const initAxiosInterceptor = () => {
    Axios.interceptors.request.use((config) => {
        const token = getToken()
        if (token) {
            config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
    });
}
