package yangtzedeltasimulatorbackend.entity.po;

import cn.hutool.core.util.IdUtil;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.bson.json.JsonObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.annotation.Id;
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
public class ModelItem {
    @Id
    @ApiModelProperty(value = "id",hidden = true)
    String id= IdUtil.objectId();
    String modelName; //模型名称
    String modelFullName; //模型全称
    String overview; //概述
    List<String> authorShips; //作者
    List<String> classifications;  //模型属于的问题分类

    @ApiModelProperty(value = "创建时间",hidden = true)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss",timezone="GMT+8")
    Date createTime=new Date(); //创建时间

    String md5; //模型的md5
    String mdl;  //模型的mdl xml直接存储为string
    Object mdlJson; //模型mdl的json格式

    List<String> dataRelateList = new ArrayList<>(); //关联的数据id s

    String modelDataConfigPath;  //模型数据文件的config.json文件绝对路径


}
