package yangtzedeltasimulatorbackend.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import yangtzedeltasimulatorbackend.entity.po.ResourceData;
import yangtzedeltasimulatorbackend.entity.po.ResourceSmallFile;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/
@Repository
public interface ResourceSmallFileDao extends MongoRepository<ResourceSmallFile, String> {

}
