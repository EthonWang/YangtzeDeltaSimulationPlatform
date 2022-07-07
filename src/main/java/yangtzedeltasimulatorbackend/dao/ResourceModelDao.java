package yangtzedeltasimulatorbackend.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import yangtzedeltasimulatorbackend.entity.po.ModelItem;
import yangtzedeltasimulatorbackend.entity.po.ResourceModel;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/
@Repository
public interface ResourceModelDao extends MongoRepository<ResourceModel, String> {
    Page<ResourceModel> findAllByNameLikeIgnoreCaseAndNormalTagsLikeIgnoreCase(String searchText, String tagName, Pageable pageable);

    Page<ResourceModel> findAllByNameLikeIgnoreCaseAndProblemTagsLikeIgnoreCase(String searchText, String tagName, Pageable pageable);
}
