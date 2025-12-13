package net.zorphy.backend.main.project.repository;

import net.zorphy.backend.main.project.entity.Project;
import org.springframework.data.repository.CrudRepository;
import org.springframework.lang.NonNull;

import java.util.List;
import java.util.UUID;

public interface ProjectRepository extends CrudRepository<Project, UUID> {
    @Override
    @NonNull
    List<Project> findAll();

    Project findByName(String name);
}
