package yangtzedeltasimulatorbackend.entity.doo.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskData {
    String statename;
    String event;
    String url;
    String visualUrl;//可展示在网页的url
    String[] urls;//一个event有多文件
    String tag;
    String suffix;
    String templateId;
    List<ParamInfo> children;

    Boolean multiple = false;//是否一个event有多文件
    Boolean visual;
}
