package yangtzedeltasimulatorbackend.entity.po;

import lombok.Data;
import org.springframework.data.annotation.Id;
import yangtzedeltasimulatorbackend.entity.doo.base.MyId;

import java.util.ArrayList;
import java.util.List;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/5/12
 **/
@Data
public class User extends MyId {

    String name;
    String email;
    String password;
    String avatar;
    String introduction;
    String address;
    String phone;
    String institution;

    List<String> modelList=new ArrayList<>();
    List<String> dataList=new ArrayList<>();;
    List<String> taskList=new ArrayList<>();;
}
