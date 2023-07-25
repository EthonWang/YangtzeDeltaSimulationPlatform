package yangtzedeltasimulatorbackend.entity.po;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

/**
 * @Description
 * @Author wyjq
 * @Date 2022/3/17
 **/
@Data
public class ResourceSmallFile {

    String name; //数据名称
    String type;

    String description; //概述
    String userEmail;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss",timezone="GMT+8")
    Date createTime=new Date(); //创建时间

    boolean publicBoolean=false;  //是否公开,默认是私有

    String fileStoreName;
    String fileWebAddress;
    String fileSize;
}

