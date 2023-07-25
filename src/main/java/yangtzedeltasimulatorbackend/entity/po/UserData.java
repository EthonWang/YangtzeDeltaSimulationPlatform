package yangtzedeltasimulatorbackend.entity.po;

import cn.hutool.core.util.IdUtil;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import yangtzedeltasimulatorbackend.entity.doo.base.MyId;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/


@Data
@Document
public class UserData {

    @Id
    @ApiModelProperty(value = "id",hidden = true)
    String id= IdUtil.objectId();

    String name; //数据名称
    String type; //数据类型，如果是文件夹则是folder，其他比如file
    String size;
    String description; //概述
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss",timezone="GMT+8")
    Date createTime=new Date(); //创建时间

    String fileStoreName;
    String fileWebAddress;
    String fileRelativePath;  //实际存储时会在文件名字中加上uuid

    String userId; //上传者ID


    String problemTags="";  //地理问题标签
    String normalTags=""; //地理数据常规标签

    String visualType;
    String visualWebAddress;
    boolean publicBoolean=false;  //是否公开,默认是私有
    boolean visualizationBoolean=false; // 是否可以可视化,默认false

    //文件夹结构相关
    String parentId;

    String dataContainerUrl="";
}

