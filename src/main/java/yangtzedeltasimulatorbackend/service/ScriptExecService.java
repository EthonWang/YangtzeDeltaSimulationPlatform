package yangtzedeltasimulatorbackend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.entity.dto.PageDTO;
import yangtzedeltasimulatorbackend.entity.dto.script.GDALClipDTO;
import yangtzedeltasimulatorbackend.utils.ExecCmdUtils;
import yangtzedeltasimulatorbackend.utils.MyFileUtils;
import yangtzedeltasimulatorbackend.utils.ResultUtils;

import javax.servlet.http.HttpServletResponse;
import javax.swing.*;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

/**
 * @Description
 * @Author wyjq
 * @Date 2022/3/17
 */

@Slf4j
@Service
public class ScriptExecService {

    @Value("${dataStoreDir}"+"/scriptOut")
    private  String scriptOutDir;

    @Value("${dataStoreDir}"+"/resourceData")
    private  String resourceDataFolder;

    public void execTest(HttpServletResponse response) {
        try{

            String outFile="test.txt";
            String outFilePath=scriptOutDir+"/"+outFile;

            List<String> argvList=new ArrayList<>();
            argvList.add(outFilePath);
            int re= ExecCmdUtils.execPython("test.py",argvList);

            if(re==0){
                MyFileUtils.downloadFile(new File(outFilePath),response);
            }
        }catch (Exception e){
            log.error(e.getMessage());
        }
    }


    public JsonResult gdalClip(GDALClipDTO gdalClipDTO) {
        try{

//            String inputShpPath=resourceDataFolder+"/"+gdalClipDTO.getInputShp();
//            String inputRasterPath=resourceDataFolder+"/"+gdalClipDTO.getInputRaster();
//            String outFilePath=scriptOutDir+"/"+gdalClipDTO.getOutputTif();

            String inputShpPath=gdalClipDTO.getInputShp();
            String inputRasterPath=gdalClipDTO.getInputRaster();
            String outFilePath=gdalClipDTO.getOutputTif();


            List<String> argvList=new ArrayList<>();
            argvList.add(inputShpPath);
            argvList.add(inputRasterPath);
            argvList.add(outFilePath);

            int re= ExecCmdUtils.execPython("GDAL_clip.py",argvList);

            if(re==0){
                return  ResultUtils.success();
            }
            return ResultUtils.error();
        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error();
        }
    }
}
