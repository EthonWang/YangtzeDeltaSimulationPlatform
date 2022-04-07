package yangtzedeltasimulatorbackend.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;

import java.util.List;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/
@Data
public class QuestionItem {
    @Id
    String id;
    String questionName;
    String overview;
    List<String> classification;
}
