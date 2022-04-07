package yangtzedeltasimulatorbackend.utils;


import yangtzedeltasimulatorbackend.entity.JsonResult;
import yangtzedeltasimulatorbackend.enums.ResultEnum;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/

public class ResultUtils {
    public static JsonResult success() {
        return success(null);
    }

    public static JsonResult success(Object obj) {
        JsonResult jsonResult = new JsonResult();
        jsonResult.setMsg(ResultEnum.SUCCESS.getMsg());
        jsonResult.setCode(ResultEnum.SUCCESS.getCode());
        jsonResult.setData(obj);
        return jsonResult;
    }

    public static JsonResult error() {
        return error(ResultEnum.ERROR.getCode(),ResultEnum.ERROR.getMsg());
    }

    public static JsonResult error(String msg) {
        return error(ResultEnum.ERROR.getCode(),msg);
    }

    public static JsonResult error(Integer code, String msg) {
        return error(code, msg, null);
    }

    public static JsonResult error(String msg, Object obj) {
        return error(ResultEnum.ERROR.getCode(), msg, obj);
    }

    public static JsonResult error(Integer code, String msg, Object obj) {
        JsonResult jsonResult = new JsonResult();
        jsonResult.setCode(code);
        jsonResult.setMsg(msg);
        jsonResult.setData(obj);
        return jsonResult;
    }

    public static JsonResult unauthorized() {
        JsonResult jsonResult = new JsonResult();
        jsonResult.setCode(ResultEnum.UNAUTHORIZED.getCode());
        jsonResult.setMsg(ResultEnum.UNAUTHORIZED.getMsg());
        return jsonResult;
    }
}
