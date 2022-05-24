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
public interface FolderDao extends MongoRepository<Folder, String> {


    List<Folder> findAllByUserEmailAndParentId(String userEmail, String parentId);

    List<Folder> findAllByParentId(String folderId);
}
