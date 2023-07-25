package yangtzedeltasimulatorbackend.entity.po;

import cn.hutool.core.util.IdUtil;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/


@Data
@Document
public class BigFileInfo {

    @Id
    @ApiModelProperty(value = "id",hidden = true)
    String id= IdUtil.objectId();

    String originName; //原来数据名称
    String storeName; //存储的名称
    String size;

}

