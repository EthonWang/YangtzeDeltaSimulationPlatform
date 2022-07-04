package yangtzedeltasimulatorbackend.service;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.io.file.FileNameUtil;
import cn.hutool.core.util.IdUtil;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import yangtzedeltasimulatorbackend.dao.DataItemDao;
import yangtzedeltasimulatorbackend.dao.FolderDao;
import yangtzedeltasimulatorbackend.dao.ThemeDao;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.entity.dto.DataItemDTO;
import yangtzedeltasimulatorbackend.entity.dto.theme.ThemeDTO;
import yangtzedeltasimulatorbackend.entity.dto.theme.UpdateThemeDTO;
import yangtzedeltasimulatorbackend.entity.po.DataItem;
import yangtzedeltasimulatorbackend.entity.po.Folder;
import yangtzedeltasimulatorbackend.entity.po.Theme;
import yangtzedeltasimulatorbackend.utils.MyFileUtils;
import yangtzedeltasimulatorbackend.utils.ResultUtils;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.util.List;
import java.util.Optional;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/18
 **/
@Slf4j
@Service
public class ThemeService {

    @Autowired
    ThemeDao themeDao;

    @Value("${dataStoreDir}"+"/themeImg")
    private  String themeImgFolder;

    public JsonResult saveTheme(ThemeDTO themeDTO) {
        try{
            Theme tempTheme=themeDao.findByName(themeDTO.getName());
            if(tempTheme==null){
                Theme theme=new Theme();
                BeanUtils.copyProperties(themeDTO,theme);
                themeDao.save(theme);
            }else{
                BeanUtils.copyProperties(themeDTO,tempTheme);
                themeDao.save(tempTheme);
            }
            return ResultUtils.success("保存专题成功");
        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("保存专题失败"+e.getMessage());
        }
    }

//    public JsonResult updateTheme(UpdateThemeDTO updateThemeDTO) {
//        try{
//            Theme theme=themeDao.findById(updateThemeDTO.getId()).get();
//            BeanUtils.copyProperties(updateThemeDTO,theme);
//            themeDao.save(theme);
//            return ResultUtils.success("更新专题成功");
//        }catch (Exception e){
//            log.error(e.getMessage());
//            return ResultUtils.error("更新专题失败"+e.getMessage());
//        }
//    }

    public JsonResult getTheme(String themeName) {
        try{
            Theme theme=themeDao.findByName(themeName);
            return ResultUtils.success(theme);
        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("获取专题失败"+e.getMessage());
        }
    }

    public JsonResult uploadThemeImg(MultipartFile uploadImg) {
        try{

            if (uploadImg.isEmpty()) {
                return ResultUtils.error("img file is empty!!e");
            }

            File folder = new File(themeImgFolder);
            if (!folder.isDirectory()) {
                folder.mkdirs();
            }

            //将zip保存到指定位置
            String fileName = uploadImg.getOriginalFilename(); //eg: XXX.png
            String fileMainName=FileNameUtil.mainName(fileName); // XXX
            String fileExtName=FileNameUtil.extName(fileName); //png
            String newfileName=fileMainName+"."+IdUtil.objectId()+"."+fileExtName;
            File saveImgFile = new File(folder, newfileName);//eg: E:\\TEMP\\XXX.zip

            uploadImg.transferTo(saveImgFile);

            String imgWebPath="/store/themeImg/"+newfileName;

            JSONObject o=new JSONObject();
            o.put("imgWebPath",imgWebPath);

            return ResultUtils.success(o);
        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("上传图片失败"+e.getMessage());
        }
    }
}