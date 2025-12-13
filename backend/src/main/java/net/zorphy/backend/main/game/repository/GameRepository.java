package net.zorphy.backend.main.game.repository;

import net.zorphy.backend.main.game.entity.Game;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.lang.NonNull;

import java.util.List;
import java.util.UUID;

public interface GameRepository extends CrudRepository<Game, UUID>, JpaSpecificationExecutor<Game> {
    @Override
    @NonNull
    List<Game> findAll();
}
