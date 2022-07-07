package yangtzedeltasimulatorbackend.dao;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import yangtzedeltasimulatorbackend.entity.po.UserData;

import java.util.List;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/
@Repository
public interface UserDataDao extends MongoRepository<UserData, String> {

    void deleteAllByParentId(String folderId);

    List<UserData> findAllByParentId(String parentId);

    List<UserData> findAllByUserId(String userId);
}
