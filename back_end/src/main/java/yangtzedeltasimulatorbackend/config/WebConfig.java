package yangtzedeltasimulatorbackend.config;

import org.springframework.boot.SpringBootConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import yangtzedeltasimulatorbackend.component.CustomInterceptor;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/

@SpringBootConfiguration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        //添加映射路径
        registry.addMapping("/**")
                //是否发送Cookie
                .allowCredentials(true)
                //设置放行哪些原始域   SpringBoot2.4.4下低版本使用.allowedOrigins("*")
                .allowedOriginPatterns("*")
                //放行哪些请求方式
                .allowedMethods(new String[]{"GET", "POST", "PUT", "DELETE"})
                //.allowedMethods("*") //或者放行全部
                //放行哪些原始请求头部信息
                .allowedHeaders("*")
                //暴露哪些原始请求头部信息
                .exposedHeaders("*");
    }

    @Bean
    public CustomInterceptor customInterceptor() {
        return new CustomInterceptor();
    }


    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        String[]  swaggerPatterns =  {
                "/swagger-resources/**",
                "/webjars/**",
                "/v2/**",
                "/swagger-ui.html/**",
                "/doc.html/**" };
        registry.addInterceptor(customInterceptor())
                .excludePathPatterns(swaggerPatterns)
                .addPathPatterns("/**");
    }


}
