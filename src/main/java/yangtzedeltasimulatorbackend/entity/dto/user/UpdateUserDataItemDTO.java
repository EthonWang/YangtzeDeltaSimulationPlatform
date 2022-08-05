package yangtzedeltasimulatorbackend.entity.dto.user;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/6/10
 **/


@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserDataItemDTO {
    String id;
    String name; //数据名称
    String description; //概述

    String problemTags="";  //地理问题标签
    String normalTags=""; //地理数据常规标签

    boolean publicBoolean=false;  //是否公开,默认是私有
    boolean visualizationBoolean=false; // 是否可以可视化,默认false

}
