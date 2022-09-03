package yangtzedeltasimulatorbackend.entity.dto.resource;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import yangtzedeltasimulatorbackend.entity.dto.PageDTO;

/**
 * @Description
 * @Author wyjq
 * @Date 2022/3/17
 **/

@Data
public class CreateResourceSmallFileDTO {
    String name; //数据名称
    String type;
    String description; //概述
    boolean publicBoolean=false;  //是否公开,默认是私有
    String visualType;


}

