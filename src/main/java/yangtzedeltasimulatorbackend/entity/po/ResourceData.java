package yangtzedeltasimulatorbackend.entity.po;

import cn.hutool.core.util.IdUtil;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/


@Data
@Document
public class ResourceData {

    @Id
    @ApiModelProperty(value = "id",hidden = true)
    String id= IdUtil.objectId();

    String name; //数据名称
    String type;
    String geoType;
    String fileSize;
    Long filesizeLong; // 补上边fileSize类型定义为String的坑，用于排序，可以不用管
    String description; //概述
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss",timezone="GMT+8")
    Date createTime=new Date(); //创建时间

    String fileStoreName;  //实际存储时会在文件名字中加上uuid
    String fileWebAddress; //数据文件下载请求的地址
    String fileRelativePath;

//    String visualStoreName; //可视化文件名字
//    String visualWebAddress; //可视化文件下载请求的地址
//    String visualRelativePath;
    ArrayList<VisualDataItem> visualDataItems = new ArrayList<>();

    String imgStoreName; //图像文件名字
    String imgWebAddress; //图像文件下载请求的地址
    String imgRelativePath;

    String userEmail; //上传者email

    String problemTags="";  //地理问题标签
    String normalTags=""; //地理数据常规标签

    boolean publicBoolean=false;  //是否公开,默认是私有
    boolean visualizationBoolean=false; // 是否可以可视化,默认false

    String visualType;

    Integer pageviews = 0;

}

