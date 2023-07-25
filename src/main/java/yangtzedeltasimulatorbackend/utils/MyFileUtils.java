package yangtzedeltasimulatorbackend.utils;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.log.Log;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URL;
import java.net.URLConnection;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

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


    public static Map readJson(File file) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.readValue(file, Map.class);
        } catch (Exception e){
            log.error("read json error.", e);
            return null;
        }
    }

    /**
     * 创建文件，如果存在的话就先删除再创建
     * @param file
     * @return boolean
     * @Author bin
     **/
    public static boolean mkFile(File file){
        try {
            if (file.exists()) {
                // 如果文件存在
                // 判断该文件的md5值
                // 如果一样的话就不用再重复上传了
                // 不一样的话就删除文件再上传
                // 这个策略不知道有没有必要，因为上传的速度本来就很快了
                // if (md5.equals(getFileMd5(localFile)))
                //     return true;
                boolean delete = file.delete();
                if (!delete) {
                    log.error("Delete exist file \"{}\" failed!!!", file.getPath(), new Exception("Delete exist file \"" + file.getPath() + "\" failed!!!"));
                    return false;
                }
            }
            // 如果文件不存在，则创建新的文件
            // 保证这个文件的父文件夹必须要存在
            if (!file.getParentFile().exists()) {
                file.getParentFile().mkdirs();
            }
            file.createNewFile();
        }catch (Exception e){
            return false;
        }
        return true;
    }

    public static File downloadRemoteData(String dataUrl,String fileDir) {
        InputStream ins = null;
        OutputStream os = null;
        try{
            URL url=new URL(dataUrl);
            URLConnection conn = url.openConnection();

            conn.connect();
            Map<String, List<String>> headerFields=conn.getHeaderFields();
            String fileName=headerFields.get("Content-Disposition").get(0).split("=")[1];
            File file=new File(fileDir, IdUtil.objectId()+"_"+fileName);

                ins= conn.getInputStream();
                os = new FileOutputStream(file);

                int length = 0;
                byte[] buffer = new byte[1024];
                while ((length = ins.read(buffer)) != -1) {
                    os.write(buffer, 0, length);
                }
                return file;
        }catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }finally {
            try {
                if (null != os) {
                    os.close();
                }
                if (null != ins) {
                    ins.close();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

}
