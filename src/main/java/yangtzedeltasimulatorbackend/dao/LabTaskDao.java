package yangtzedeltasimulatorbackend.dao;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import yangtzedeltasimulatorbackend.entity.po.Folder;
import yangtzedeltasimulatorbackend.entity.po.LabTask;

import java.util.List;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/
@Repository
public interface LabTaskDao extends MongoRepository<LabTask, String> {

    List<LabTask> findAllByUserId(String userId);
}
