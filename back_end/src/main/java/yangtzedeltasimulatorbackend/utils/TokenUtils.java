package yangtzedeltasimulatorbackend.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import lombok.extern.slf4j.Slf4j;

import java.util.Calendar;
import java.util.Date;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/5/12
 **/

@Slf4j
public class TokenUtils {


    public static String createToken(String userId){

        Calendar nowTime = Calendar.getInstance();
        nowTime.add(Calendar.MINUTE,3000000); //300分钟,失效
        Date expiresDate = nowTime.getTime();

        return JWT.create().withAudience(userId)
                .withExpiresAt(expiresDate)
                .sign(Algorithm.HMAC256("wangyijie"));
    }

    public static String getUserId(String jwtToken){
        try {
            return JWT.decode(jwtToken).getAudience().get(0);
        }catch (JWTDecodeException e){
            log.error("jwtToken 解码失败: " + e);
            return null;
        }
    }


}
