package yangtzedeltasimulatorbackend.utils;

import cn.hutool.core.io.FileUtil;
import cn.hutool.log.Log;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import lombok.extern.slf4j.Slf4j;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.OutputStream;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/5/14
 **/
@Slf4j
public class MyFileUtils {
    public static void downloadFile(File file, HttpServletResponse response){
        try{
            response.reset();
            response.setContentType("application/octet-stream");
            response.setCharacterEncoding("utf-8");
            response.setContentLength((int) file.length());
            //解决页面下载框中文乱码问题
            response.setHeader("Content-Disposition", "attachment;filename=" + new String(file.getName().getBytes("UTF-8"),"iso-8859-1"));

            byte[] readBytes = FileUtil.readBytes(file);
            OutputStream os = response.getOutputStream();
            os.write(readBytes);
        }catch (Exception e){
            log.error(e.getMessage());
        }
    }
}
