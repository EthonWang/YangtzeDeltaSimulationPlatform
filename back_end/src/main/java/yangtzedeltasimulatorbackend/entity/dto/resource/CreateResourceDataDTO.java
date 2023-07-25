package yangtzedeltasimulatorbackend.entity.dto.resource;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/6/11
 **/

@Data
public class CreateResourceDataDTO {

    String name; //数据名称
    String type;
    String geoType;

    String description; //概述

    String problemTags="";  //地理问题标签
    String normalTags=""; //地理数据常规标签

    boolean publicBoolean=false;  //是否公开,默认是私有
    boolean visualizationBoolean=false; // 是否可以可视化,默认false

    String fileStoreName; //上传好的大文件的存储名字

    String fileSize;

    String visualType;

    String fileOriginName; //大文件的原始名字
}
