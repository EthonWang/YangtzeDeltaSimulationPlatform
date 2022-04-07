package yangtzedeltasimulatorbackend.dao;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import yangtzedeltasimulatorbackend.entity.DataItem;
import yangtzedeltasimulatorbackend.entity.QuestionItem;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/
@Repository
public interface QuestionItemDao extends MongoRepository<QuestionItem, String> {

}
