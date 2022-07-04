package yangtzedeltasimulatorbackend.entity.po;

import lombok.Data;
import org.springframework.data.annotation.Id;
import yangtzedeltasimulatorbackend.entity.doo.base.MyId;
import yangtzedeltasimulatorbackend.entity.doo.integrate.Model;
import yangtzedeltasimulatorbackend.entity.doo.integrate.ModelParam;
import yangtzedeltasimulatorbackend.entity.doo.support.TaskData;

import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/5/5
 **/
@Data
public class Task extends MyId {
    String taskId;
    String computableId;
    String computableName;
    String email;  //原来的userId
    String ip;
    String description;
    int port;
    int loadTime;

    Date runTime;

    int status;//Started: 1, Finished: 2, Inited: 0, Error: -1

    //    List<String> publicBoolean;//public ;noPublic ;userNames; public和noPublic都放数组头
    String permission;
    List<TaskData> inputs;
    List<TaskData> outputs;

    boolean flag = true;

    //集成模型
    Boolean integrate;
    List<Model> models;
    String graphXml;
    List<ModelParam> modelParams;

}
