package yangtzedeltasimulatorbackend.entity.dto.resource;

import cn.hutool.core.util.IdUtil;
import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.data.annotation.Id;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/

@Data
public class CreateResourceModelDTO {

    String name; //模型名称
    String overview; //概述
    List<String> authorShips; //作者

    String problemTags="";  //地理问题标签
    String normalTags=""; //地理数据常规标签

    String md5; //模型的md5
    String mdl;  //模型的mdl xml直接存储为string
    Object mdlJson; //模型mdl的json格式
}
