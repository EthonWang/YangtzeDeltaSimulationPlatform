package yangtzedeltasimulatorbackend.dao;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import yangtzedeltasimulatorbackend.entity.po.MyCase;

import java.util.Optional;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/
@Repository
public interface MyCaseDao extends MongoRepository<MyCase, String> {

    Optional<MyCase> findByName(String caseName);
}
