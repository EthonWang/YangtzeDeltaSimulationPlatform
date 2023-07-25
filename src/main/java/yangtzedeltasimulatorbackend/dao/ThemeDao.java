package yangtzedeltasimulatorbackend.dao;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import yangtzedeltasimulatorbackend.entity.po.Theme;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/
@Repository
public interface ThemeDao extends MongoRepository<Theme, String> {

    Theme findByName(String themeName);
}
