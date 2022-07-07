package yangtzedeltasimulatorbackend.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.List;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/6/7
 **/

@Slf4j
@Component
public class InitStoreDir implements ApplicationListener<ContextRefreshedEvent> {

    @Value("${dataStoreDir}")
    String dataStoreDir;

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        String []folderNames={"bigFileTemp","data","models","resourceData","scriptOut","themeImg","noClassFile"};

        for(int i=0;i<folderNames.length;i++){
            File file=new File(dataStoreDir,folderNames[i]);
            if (!file.exists()){
                if (file.mkdirs()){
                    System.out.println("创建" + file.getAbsolutePath() + "成功");
                }
            }
        }

//        if (event.getApplicationContext().getParent() == null) {
//            System.out.println("222222222DoByApplicationListener do something");
//        }
    }
}
