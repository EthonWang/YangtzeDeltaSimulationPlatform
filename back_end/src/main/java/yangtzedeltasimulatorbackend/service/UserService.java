package yangtzedeltasimulatorbackend.service;

import cn.hutool.core.io.file.FileNameUtil;
import cn.hutool.core.util.IdUtil;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import yangtzedeltasimulatorbackend.dao.UserDao;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.entity.dto.user.UserSignUpDTO;
import yangtzedeltasimulatorbackend.entity.po.User;
import yangtzedeltasimulatorbackend.utils.ResultUtils;
import yangtzedeltasimulatorbackend.utils.TokenUtils;

import javax.jws.soap.SOAPBinding;
import java.io.File;
import java.util.Optional;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/5/12
 **/

@Slf4j
@Service
public class UserService {

    @Autowired
    UserDao userDao;

    @Value("${dataStoreDir}"+"/userImg")
    private  String userImgFolder;

    public JsonResult signUp(UserSignUpDTO userSignUpDTO) {
        try{

            Optional<User> userDB= userDao.findByEmail(userSignUpDTO.getEmail());
            if(userDB.isPresent()){
                return ResultUtils.error("user is already exist: "+userSignUpDTO.getEmail());
            }

            User user=new User();
            BeanUtils.copyProperties(userSignUpDTO, user);
            user.setPassword(DigestUtils.sha256Hex(user.getPassword()));
            userDao.insert(user);

            log.info("注册成功："+userSignUpDTO.getEmail());
            return ResultUtils.success("注册成功");

        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("注册失败");
        }

    }

    public JsonResult login(String email, String password) {
        try{
            Optional<User> userDB = userDao.findByEmail(email);
            if (!userDB.isPresent()) {
                return ResultUtils.error("没有该用户: "+email);
            }
            User loginUser = userDB.get();
            if (!loginUser.getPassword().equals(DigestUtils.sha256Hex(password))){
                return ResultUtils.error("密码错误");
            }

            String userId=userDB.get().getId();
            String token= TokenUtils.createToken(userId);
            JSONObject userInfo = new JSONObject();
            userInfo.put("userId", loginUser.getEmail());
            userInfo.put("username", loginUser.getName());
            userInfo.put("token", token);

            log.info("登陆成功: "+email);
            return ResultUtils.success(userInfo);
        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("登录失败");
        }

    }


    public JsonResult getUserInfo(String email) {
        try{
            Optional<User> userDB=userDao.findByEmail(email);
            User user=userDB.get();
            user.setPassword("");

            return ResultUtils.success(user);
        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("获取用户信息失败");
        }
    }


    public JsonResult updateUserInfo(User userUpdate) {

        try{
            Optional<User> userDB=userDao.findByEmail(userUpdate.getEmail());
            User user=userDB.get();
            BeanUtils.copyProperties(userUpdate, user,"id","email","password");
            userDao.save(user);

            return ResultUtils.success(user);

        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("更新用户信息失败");
        }
    }

    public JsonResult uploadUserPic(String userId, MultipartFile upUserPic) {
        try{
            User user=userDao.findById(userId).get();


            if (upUserPic.isEmpty()) {
                return ResultUtils.error("img file is empty!!e");
            }

            String fileName = upUserPic.getOriginalFilename(); //eg: XXX.png
            String fileMainName= FileNameUtil.mainName(fileName); // XXX
            String fileExtName=FileNameUtil.extName(fileName); //png
            String newfileName=fileMainName+"."+ IdUtil.objectId()+"."+fileExtName;
            File saveImgFile = new File(userImgFolder, newfileName);//eg: E:\\TEMP\\XXX.zip

            upUserPic.transferTo(saveImgFile);

            String imgWebPath="/store/userImg/"+newfileName;

            user.setAvatar(imgWebPath);
            userDao.save(user);

//            JSONObject o=new JSONObject();
//            o.put("imgWebPath",imgWebPath);

            return ResultUtils.success("上传用户头像成功");
        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("上传图片失败"+e.getMessage());
        }
    }
}
