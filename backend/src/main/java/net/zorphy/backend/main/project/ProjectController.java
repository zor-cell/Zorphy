package net.zorphy.backend.main.project;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import net.zorphy.backend.main.project.dto.ProjectDetails;
import net.zorphy.backend.main.project.dto.ProjectMetadata;
import net.zorphy.backend.main.project.service.ProjectService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.lang.invoke.MethodHandles;
import java.util.List;

@RestController
@RequestMapping("/projects")
public class ProjectController {
    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    private String getBaseUrlFromRequest(HttpServletRequest request) {
        return request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + "/api";
    }

    @GetMapping()
    public List<ProjectMetadata> getProjects(HttpServletRequest request) {
        return projectService.getProjects(getBaseUrlFromRequest(request));
    }

    @GetMapping("/{name}")
    public ProjectDetails getProject(@NotBlank @PathVariable String name, HttpServletRequest request) {
        return projectService.getProject(name, getBaseUrlFromRequest(request));
    }


    @Secured("ROLE_ADMIN")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProjectDetails createProject(HttpServletRequest request,
                                        @RequestPart("project") @Valid ProjectDetails projectDetails,
                                        @RequestPart(value = "image", required = false) MultipartFile image) {
        return projectService.createProject(projectDetails, image, getBaseUrlFromRequest(request));
    }

    @Secured("ROLE_ADMIN")
    @PutMapping
    public ProjectDetails updateProject( HttpServletRequest request,
                                         @Valid @RequestBody ProjectDetails projectDetails) {
        return projectService.updateProject(projectDetails, getBaseUrlFromRequest(request));
    }
}
