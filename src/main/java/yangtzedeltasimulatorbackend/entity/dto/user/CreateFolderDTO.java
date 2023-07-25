package yangtzedeltasimulatorbackend.entity.dto.user;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.Date;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/6/11
 **/
@Data
public class CreateFolderDTO {
    String name;
    String parentId;

    boolean publicBoolean=false;

    String description;
    String problemTags="";  //地理问题标签
}
