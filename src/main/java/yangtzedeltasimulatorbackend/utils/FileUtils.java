package yangtzedeltasimulatorbackend.utils;

import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;

import java.io.*;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

@Slf4j
public class FileUtils {
    private static final int  BUFFER_SIZE = 1024;


    /**
     * 解压文件
     * @param inputDir 输入的文件路径
     * @param destDir 输出的文件路径
     * @return java.util.List<com.alibaba.fastjson.JSONObject>
     * @Author bin
     **/
    public static List<JSONObject> zipUncompress(String inputDir, String destDir) throws Exception {
        File destDirFolder = new File(destDir);
        if (!destDirFolder.isDirectory()) {
            destDirFolder.mkdirs();
        }
        // 压缩的文件的路径
        List<JSONObject> fileList = new ArrayList<>();
        File srcFile = new File(inputDir);
        if (!srcFile.exists()){
            throw new Exception(srcFile.getPath() + "所指文件不存在");
        }
        // 第二个参数设置编码，防止处理文件名存在中文的zip包时，控制台报错
        long start = System.currentTimeMillis();
        ZipFile zipFile = new ZipFile(srcFile, Charset.forName("GBK"));
        Enumeration<?> entries = zipFile.entries();
        while (entries.hasMoreElements()) {
            ZipEntry entry = (ZipEntry) entries.nextElement();
            if (entry.isDirectory()) {
                // 如果是文件夹，就创建个文件夹
                File newfolder = new File(destDir + "/" + entry.getName());
                newfolder.mkdirs();
            } else {
                // 如果是文件，就先创建一个文件，然后用io流把内容copy过去
                String uploadPath = destDir + "/" + entry.getName();
                File targetFile = new File(uploadPath);
                mkFile(targetFile);
                // 将压缩文件内容写入到这个文件中
                uploadFileByBufferStream(zipFile.getInputStream(entry), targetFile);

                //把文件绝对路径加到pathList里
                JSONObject o = new JSONObject();
                o.put("fileName",targetFile.getName());
                o.put("path", uploadPath);
                o.put("fileSize", entry.getSize());
                fileList.add(o);
            }
        }
        zipFile.close();
        long end = System.currentTimeMillis();
        log.info("zip uncompress success");
        return fileList;
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

    /**
     * 通过缓冲流上传文件
     * @param in
     * @param localFile
     * @return boolean
     * @Author bin
     **/
    public static boolean uploadFileByBufferStream(InputStream in, File localFile){

        BufferedInputStream bis = null;
        BufferedOutputStream bos = null;
        FileOutputStream fos = null;
        // InputStream in = null;
        try {
            //如果文件不存在，则创建新的文件
            if (!localFile.exists()) {
                localFile.createNewFile();
            }

            // 1.造节点流
            fos = new FileOutputStream(localFile);
            // in = file.getInputStream();

            // 2.造缓冲流
            bis = new BufferedInputStream(in);
            bos = new BufferedOutputStream(fos);

            // 3.复制的细节：读取、写入
            byte[] bytes = new byte[1024];
            int len;
            while ((len = bis.read(bytes)) != -1) {
                bos.write(bytes, 0, len);
            }
            bos.flush();
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        } finally {
            try {
                if (bos != null) {
                    bos.close();
                }
                if (bis != null) {
                    bis.close();
                }
            }catch (IOException e) {
                log.error("InputStream or OutputStream close error");
                return false;
            }
        }
        return true;
    }
}
