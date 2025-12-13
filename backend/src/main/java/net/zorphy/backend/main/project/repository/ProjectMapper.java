package net.zorphy.backend.main.project.repository;

import net.zorphy.backend.main.file.component.FileReaderComponent;
import net.zorphy.backend.main.file.component.FileUrlComponent;
import net.zorphy.backend.main.project.dto.ProjectDetails;
import net.zorphy.backend.main.project.dto.ProjectMetadata;
import net.zorphy.backend.main.project.entity.Project;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {FileReaderComponent.class, FileUrlComponent.class})
public abstract class ProjectMapper {
    @Mapping(source = "imagePath", target = "imagePath", qualifiedByName = "resolveFileUrl")
    public abstract ProjectMetadata projectToProjectMetadata(Project project);

    @Mapping(source = "project", target = "metadata")
    @Mapping(source = "filePath", target = "content", qualifiedByName = "readHtmlFromMarkdown")
    public abstract ProjectDetails projectToProjectDetails(Project project);

    @Mapping(source = "metadata", target = ".")
    public abstract Project projectDetailsToProject(ProjectDetails projectDetails);
}
