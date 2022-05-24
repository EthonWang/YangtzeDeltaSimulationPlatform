package yangtzedeltasimulatorbackend.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

import java.util.Calendar;
import java.util.Date;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/5/12
 **/

public class TokenUtils {


    public static String createToken(String email){

        Calendar nowTime = Calendar.getInstance();
        nowTime.add(Calendar.MINUTE,300); //300分钟,失效
        Date expiresDate = nowTime.getTime();


        return JWT.create().withAudience(email)
                .withExpiresAt(expiresDate)
                .sign(Algorithm.HMAC256("wangyijie"));

    }


}
