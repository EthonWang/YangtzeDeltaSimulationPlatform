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
public class DataItem {

    @Id
    String id;
    String dataName; //数据名称
    String dataType;
    String overview; //概述
    List<String> keywords; //关键词
    List<String> classifications;  //数据分类
    List<String> authorships; //作者
    String createTime; //创建时间

    List<String> dataRelateList = new ArrayList<>(); //关联的数据id s
    List<String> modelRelateList = new ArrayList<>(); //关联的模型id s 一个条目可能有多个运行程序？
}

