import {Component, inject, OnInit, signal, viewChild} from '@angular/core';
import {ProjectService} from "../../../services/project.service";
import {ProjectMetadata} from "../../../dto/projects/ProjectMetadata";

import {ProjectCardComponent} from "../project-card/project-card.component";
import {MainHeaderComponent} from '../../all/main-header/main-header.component';
import {AuthService} from "../../../services/auth.service";
import {ProjectUpdatePopupComponent} from "../popups/update-popup/update-popup.component";
import {ProjectDetails} from "../../../dto/projects/ProjectDetails";
import {WithFile} from "../../../dto/all/WithFile";

@Component({
    selector: 'project-list',
    imports: [ProjectCardComponent, MainHeaderComponent, ProjectUpdatePopupComponent],
    templateUrl: './project-list.component.html',
    
    styleUrl: './project-list.component.css'
})
export class ProjectListComponent implements OnInit {
    protected authService = inject(AuthService);
    private projectService = inject(ProjectService);

    private createPopup = viewChild.required<ProjectUpdatePopupComponent>('createPopup');
    protected projects = signal<ProjectMetadata[]>([]);

    ngOnInit() {
        this.getProjects();
    }

    protected openCreatePopup() {
        this.createPopup().openPopup();
    }

    protected createProject(event: WithFile<ProjectDetails>) {
        this.projectService.createProject(event.data, event.file).subscribe(res => {
            this.getProjects();
        });
    }

    private getProjects() {
        this.projectService.getProjects().subscribe(res => {
            this.projects.set(res);
        });
    }
}
