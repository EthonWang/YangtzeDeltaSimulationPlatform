package yangtzedeltasimulatorbackend.entity.dto.user;

import lombok.Data;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/5/12
 **/
@Data
public class UserLoginDTO {
    String email;
    String password;
}
