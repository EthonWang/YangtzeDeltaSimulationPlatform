package yangtzedeltasimulatorbackend.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import yangtzedeltasimulatorbackend.entity.po.ResourceData;

import java.util.List;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/
@Repository
public interface ResourceDataDao extends MongoRepository<ResourceData, String> {

    Object findByName(String searchText);

    Page<ResourceData> findAllByNameLikeIgnoreCase(String s, Pageable pageable);

    Page<ResourceData> findAllByNameLikeIgnoreCaseAndProblemTagsLikeIgnoreCase(String searchText, String tagName, Pageable pageable);

    Page<ResourceData> findAllByNameLikeIgnoreCaseAndNormalTagsLikeIgnoreCase(String searchText, String tagName, Pageable pageable);

    Page<ResourceData> findAllByNameLikeIgnoreCaseAndProblemTagsLikeIgnoreCaseAndVisualizationBoolean(String searchText, String tagName, Boolean visualChecked, Pageable pageable);

    Page<ResourceData> findAllByNameLikeIgnoreCaseAndNormalTagsLikeIgnoreCaseAndVisualizationBoolean(String searchText, String tagName, Boolean visualChecked, Pageable pageable);

    List<ResourceData> findAllByPageviews();

}
