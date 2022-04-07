package yangtzedeltasimulatorbackend.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;

import java.util.ArrayList;
import java.util.List;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/

@Data
public class ModelItem {

    @Id
    String id;
    String modelName; //模型名称
    List<String> alias; //别名
    String overview; //概述
    List<String> keywords; //关键词
    List<String> classifications;  //模型分类
    List<String> authorships; //作者
    String createTime; //创建时间

    List<String> dataRelateList = new ArrayList<>(); //关联的数据id s
    List<String> modelRelateList = new ArrayList<>(); //关联的模型id s 一个条目可能有多个运行程序？

}
