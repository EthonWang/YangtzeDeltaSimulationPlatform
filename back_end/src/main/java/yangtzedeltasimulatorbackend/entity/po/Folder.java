package yangtzedeltasimulatorbackend.entity.po;

import cn.hutool.core.util.IdUtil;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.data.annotation.Id;
import yangtzedeltasimulatorbackend.entity.doo.base.MyId;

import java.util.Date;
import java.util.List;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/5/13
 **/

@Data
public class Folder {
    @Id
    @ApiModelProperty(value = "id",hidden = true)
    String id= IdUtil.objectId();
    String name;
    String parentId;

    @ApiModelProperty(value = "创建时间", hidden = true)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    Date createTime = new Date(); //创建时间

    @ApiModelProperty(value = "用户id", hidden = true)
    String userId;

    @ApiModelProperty(value = "是文件夹标识", hidden = true)
    String type = "folder";
    boolean publicBoolean=false;

    String description;
    String problemTags="";  //地理问题标签
}