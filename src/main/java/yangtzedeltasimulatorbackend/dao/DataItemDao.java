package yangtzedeltasimulatorbackend.dao;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import yangtzedeltasimulatorbackend.entity.DataItem;
import yangtzedeltasimulatorbackend.entity.ModelItem;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/
@Repository
public interface DataItemDao extends MongoRepository<DataItem, String> {
}
