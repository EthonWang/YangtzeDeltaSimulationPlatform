package yangtzedeltasimulatorbackend.entity.po;

import lombok.Data;
import org.springframework.data.annotation.Id;

import java.util.ArrayList;
import java.util.List;

/**
 * @Description 长三角四大问题
 * @Auther wyjq
 * @Date 2022/4/6
 **/


@Data
public class QuestionItem {

    @Id
    String id;
    String questionName;
    String overview;

    List<String> modelRelateList = new ArrayList<>(); //关联的模型列表 ids

}
