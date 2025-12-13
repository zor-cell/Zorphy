package net.zorphy.backend.main.project.service;

import net.zorphy.backend.main.project.dto.ProjectDetails;
import net.zorphy.backend.main.project.dto.ProjectMetadata;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProjectService {
    List<ProjectMetadata> getProjects(String baseUrl);

    ProjectDetails getProject(String name, String baseUrl);

    ProjectDetails updateProject(ProjectDetails project, String baseUrl);

    ProjectDetails createProject(ProjectDetails project, MultipartFile image, String baseUrl);
}
