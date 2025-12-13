package net.zorphy.backend.main.user.repository;

import net.zorphy.backend.main.user.entity.User;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface UserRepository extends CrudRepository<User, UUID> {
    User findByUsername(String username);
}
