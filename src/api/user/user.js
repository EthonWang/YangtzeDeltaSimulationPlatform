import {get ,post} from "@/request/request_backup"

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
    uploadAvatar(user_id,picture){
        return post('/user/uploadUserPic/'+user_id,picture)
    }
    // editPassword(){}
    // editAvator(){}
}
