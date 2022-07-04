package yangtzedeltasimulatorbackend.dao;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import yangtzedeltasimulatorbackend.entity.po.DataItem;
import yangtzedeltasimulatorbackend.entity.po.Folder;

import java.util.List;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/
@Repository
public interface DataItemDao extends MongoRepository<DataItem, String> {

    void deleteAllByParentId(String folderId);

    List<DataItem> findAllByParentId(String parentId);

    List<DataItem> findAllByUserId(String userId);
}
