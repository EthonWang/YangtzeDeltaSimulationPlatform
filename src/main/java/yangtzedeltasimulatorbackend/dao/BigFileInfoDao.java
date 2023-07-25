package yangtzedeltasimulatorbackend.dao;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import yangtzedeltasimulatorbackend.entity.po.BigFileInfo;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/
@Repository
public interface BigFileInfoDao extends MongoRepository<BigFileInfo, String> {

}
