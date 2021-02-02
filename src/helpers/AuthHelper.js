import jwt_decode from 'jwt-decode';
import Axios from "axios";
import galleta from 'js-cookie'


class AuthService {

    login = async (username, password) => {
        return await Axios.post(process.env.REACT_APP_API_URL + "session/login", {
            username: username,
            password: password
        }).then(res => {
            if(res.data.auth == true){
                galleta.set('user', {'user':res.data},{expires:1/3})
                console.log(galleta.getJSON('user'))
                let name = jwt_decode(res.data.token).names
                localStorage.setItem("name", name)
            }
            return res.data
        })
    }
    async logout(){
        galleta.remove('user')
        const logout = await Axios.post(process.env.REACT_APP_API_URL + "session/logout",{},{withCredentials:true})
    }

    isAuthenticated(){
        if (galleta.get('user')){
            return true
        } else {
            return false
        }
    }

    getUserId(){
        let token = galleta.get("user")
        if (token){
            let decoded = jwt_decode(token);
            return decoded.id;
        }
    }

    getName = () => localStorage.getItem("name")

}


export default new AuthService();