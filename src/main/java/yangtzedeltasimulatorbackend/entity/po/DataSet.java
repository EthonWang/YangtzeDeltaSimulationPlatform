package yangtzedeltasimulatorbackend.entity.po;

import cn.hutool.core.util.IdUtil;
import com.alibaba.fastjson.JSONArray;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/


@Data
@Document
public class DataSet {

    String name; //数据集名称
    JSONArray dataList;
}

