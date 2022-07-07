package yangtzedeltasimulatorbackend.dao;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import yangtzedeltasimulatorbackend.entity.po.BigFileInfo;
import yangtzedeltasimulatorbackend.entity.po.Case;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/
@Repository
public interface CaseDao extends MongoRepository<Case, String> {

}
