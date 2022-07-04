package yangtzedeltasimulatorbackend.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import javax.swing.event.ListDataEvent;
import javax.swing.text.StyledEditorKit;
import java.util.List;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/5/13
 **/

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DataItemDTO {
    String name;
    String description;
    String parentId;
    boolean publicBoolean;
    String problemTags;
}
