package yangtzedeltasimulatorbackend.dao;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import yangtzedeltasimulatorbackend.entity.po.Task;
import yangtzedeltasimulatorbackend.entity.po.User;

import java.util.Optional;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/5/12
 **/



@Repository
public interface UserDao extends MongoRepository<User, String> {


    Optional<User> findByEmail(String email);

}