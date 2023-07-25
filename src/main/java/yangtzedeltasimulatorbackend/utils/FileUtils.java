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
import java.util.zip.ZipOutputStream;

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
     * @param srcDir  压缩文件夹路径
     * @param out  压缩文件输出流
     * @param KeepDirStructure   是否保留原来的目录结构,true:保留目录结构; false:所有文件跑到压缩包根目录下(注意：不保留目录结构可能会出现同名文件,会压缩失败)
     * @return: void
     * @Description:  压缩成zip
     * @Author: ZhaoYiming
     * @Date: 2022-8-4 23:09
     */
    public static void toZip(String srcDir, OutputStream out, boolean KeepDirStructure) throws RuntimeException {

        long start = System.currentTimeMillis();
        ZipOutputStream zos = null;
        try {
            zos = new ZipOutputStream(out);
            File sourceFile = new File(srcDir);
            compress(sourceFile, zos, sourceFile.getName(), KeepDirStructure);
            long end = System.currentTimeMillis();
            log.debug("压缩完成，耗时：" + (end - start) + " ms");
        } catch (Exception e) {
            throw new RuntimeException("zip error from ZipUtils", e);
        } finally {
            if (zos != null) {
                try {
                    zos.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * @param sourceFile  源文件
     * @param zos   zip输出流
     * @param name  压缩后的名称
     * @param KeepDirStructure   是否保留原来的目录结构,true:保留目录结构; false:所有文件跑到压缩包根目录下(注意：不保留目录结构可能会出现同名文件,会压缩失败)
     * @return: void 
     * @Description:  递归压缩方法
     * @Author: ZhaoYiming
     * @Date: 2022-8-4 23:11
     */
    private static void compress(File sourceFile, ZipOutputStream zos, String name, boolean KeepDirStructure)
            throws Exception {
        byte[] buf = new byte[BUFFER_SIZE];
        if (sourceFile.isFile()) {
            // 向zip输出流中添加一个zip实体，构造器中name为zip实体的文件的名字
            zos.putNextEntry(new ZipEntry(name));
            // copy文件到zip输出流中
            int len;
            FileInputStream in = new FileInputStream(sourceFile);
            while ((len = in.read(buf)) != -1) {
                zos.write(buf, 0, len);
            }
            // Complete the entry
            zos.closeEntry();
            in.close();
        } else {
            File[] listFiles = sourceFile.listFiles();
            if (listFiles == null || listFiles.length == 0) {
                // 需要保留原来的文件结构时,需要对空文件夹进行处理
                if (KeepDirStructure) {
                    // 空文件夹的处理
                    zos.putNextEntry(new ZipEntry(name + "/"));
                    // 没有文件，不需要文件的copy
                    zos.closeEntry();
                }

            } else {
                for (File file : listFiles) {
                    // 判断是否需要保留原来的文件结构
                    if (KeepDirStructure) {
                        // 注意：file.getName()前面需要带上父文件夹的名字加一斜杠,
                        // 不然最后压缩包中就不能保留原来的文件结构,即：所有文件都跑到压缩包根目录下了
                        compress(file, zos, name + "/" + file.getName(), KeepDirStructure);
                    } else {
                        compress(file, zos, file.getName(), KeepDirStructure);
                    }

                }
            }
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

    /**
     * @param source
     * @param dest
     * @return: void
     * @Description:  文件复制
     * @Author: ZhaoYiming
     * @Date: 2022-8-4 23:01
     */
    public static void copyFileUsingStream(File source, File dest) throws IOException {
        InputStream is = null;
        OutputStream os = null;
        try {
            is = new FileInputStream(source);
            os = new FileOutputStream(dest);
            byte[] buffer = new byte[1024];
            int length;
            while ((length = is.read(buffer)) > 0) {
                os.write(buffer, 0, length);
            }
        } finally {
            is.close();
            os.close();
        }
    }
}
