package yangtzedeltasimulatorbackend.service;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import yangtzedeltasimulatorbackend.entity.dto.PageDTO;


/**
 * @Description
 * @Author wyjq
 * @Date 2022/3/17
 */

@Service
public class CommonService {
    public Pageable getPageable(PageDTO pageDTO){
        return PageRequest.of(pageDTO.getPage()-1, pageDTO.getPageSize(), Sort.by(pageDTO.getAsc()? Sort.Direction.ASC: Sort.Direction.DESC,pageDTO.getSortField()));
    }
}
