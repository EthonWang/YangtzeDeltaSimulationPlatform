import {get ,post} from "@/request/request"

export default class{
    register(user){
        return post('/user/signUp',user)
    }
    getUserInfo(email){
        return get('/user/getUserInfo/'+email)
    }
    login(email,password){
        return post('/user/login',{email:email,password:password})
    }
    editUserInfo(user){
        return post('/user/updateUserInfo',user)
    }
    // editPassword(){}
    // editAvator(){}
}
