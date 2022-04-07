package yangtzedeltasimulatorbackend.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import yangtzedeltasimulatorbackend.entity.JsonResult;
import yangtzedeltasimulatorbackend.utils.ResultUtils;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/
@RestController
public class HelloWorldController {

    @ApiOperation(value = "HelloWorld测试")
    @GetMapping("/hello")
    public JsonResult handle(){
        return ResultUtils.success("okkkkk!");
    }

}
