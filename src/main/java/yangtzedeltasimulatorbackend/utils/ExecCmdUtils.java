package yangtzedeltasimulatorbackend.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.MessageFormat;
import java.util.List;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/6/28
 **/
@Slf4j
public class ExecCmdUtils {

    @Value("${dataStoreDir}")
    private static String dataResourceDir;

    //执行python脚本
    public static int execPython(String pyScriptName, List<String> argvList){

        String scriptsDir= dataResourceDir + "/static/myScripts/"; //eg: e:\\xx\static\\myScripts\\
        String pyPath = scriptsDir + pyScriptName; //eg: eg: e:\\xx\static\\myScripts\\test.py

        String cmdString="python ";
        cmdString+=pyPath;  //eg: python eg: e:\\xx\static\\myScripts\\test.py
        for (int i=0;i<argvList.size();i++){
            cmdString+=" "+argvList.get(i);
        }

        try {
            log.info("开始执行脚本："+pyScriptName);
            Process proc = Runtime.getRuntime().exec(cmdString);// 执行py文件

            //获取错误输入流
            BufferedReader err = new BufferedReader(new InputStreamReader(proc.getErrorStream()));
            String errLine = null;
            while ((errLine = err.readLine()) != null) {
                log.info("errStream: "+errLine);
            }
            err.close();

            //获取正常输入流
            BufferedReader in = new BufferedReader(new InputStreamReader(proc.getInputStream()));
            String inLine = null;
            while ((inLine = in.readLine()) != null) {
                log.info("inputStream: "+inLine);
            }
            in.close();

            int exitVal =proc.waitFor(); //返回值如果是0表示正常结束

            return exitVal;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return -1;
        }
    }
}
