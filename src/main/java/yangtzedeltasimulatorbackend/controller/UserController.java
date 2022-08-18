package yangtzedeltasimulatorbackend.controller;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.entity.dto.user.UserLoginDTO;
import yangtzedeltasimulatorbackend.entity.dto.user.UserSignUpDTO;
import yangtzedeltasimulatorbackend.entity.po.User;
import yangtzedeltasimulatorbackend.service.UserService;
import yangtzedeltasimulatorbackend.utils.ResultUtils;

import javax.servlet.http.HttpServletRequest;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/5/12
 **/


@RestController
@RequestMapping(value="/user")
public class UserController{

    @Autowired
    UserService userService;


    @ApiOperation(value = "用户注册")
    @PostMapping("/signUp")
    public JsonResult signUp(@RequestBody UserSignUpDTO userSignUpDTO){
        return userService.signUp(userSignUpDTO);
    }

    @ApiOperation(value = "用户登录")
    @PostMapping(value = "/login")
    public JsonResult login(@RequestBody UserLoginDTO userLoginDTO) {
        return userService.login(userLoginDTO.getEmail(),userLoginDTO.getPassword());
    }

    @ApiOperation(value = "获取用户基本信息")
    @GetMapping(value = "/getUserInfo/{email}")
    public JsonResult getUserInfo(@PathVariable(value = "email") String email){
        return userService.getUserInfo(email);
    }

    @ApiOperation(value = "更新用户信息")
    @PostMapping(value = "/updateUserInfo")
    public JsonResult updateUserInfo(@RequestBody User userUpdate){
        return userService.updateUserInfo(userUpdate);
    }

    @ApiOperation(value = "上传用户头像")
    @PostMapping(value = "/uploadUserPic/{userId}")
    public JsonResult uploadUserPic(@PathVariable("userId") String userId,
                                    @RequestPart("userPic") MultipartFile upUserPic){
        return userService.uploadUserPic(userId,upUserPic);
    }

}
