import {Component, inject, OnInit, signal, viewChild} from '@angular/core';
import {ProjectDetails} from "../../dto/ProjectDetails";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {ProjectService} from "../../project.service";

import {MainHeaderComponent} from "../../../core/components/main-header/main-header.component";
import {ProjectUpdatePopupComponent} from "../popups/update-popup/update-popup.component";
import {AuthService} from "../../../core/services/auth.service";
import {WithFile} from "../../../core/dto/WithFile";

@Component({
    selector: 'project-info',
    imports: [
    RouterLink,
    MainHeaderComponent,
    ProjectUpdatePopupComponent
],
    templateUrl: './project-info.component.html',
    
    styleUrl: './project-info.component.css'
})
export class ProjectInfoComponent implements OnInit {
    protected authService = inject(AuthService);
    private projectService = inject(ProjectService);
    private route = inject(ActivatedRoute);

    private updatePopup = viewChild.required<ProjectUpdatePopupComponent>('updatePopup');
    protected project = signal<ProjectDetails | null>(null);

    private projectName: string | null = null;

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.projectName = params.get('name');

            this.getProject();
        });
    }

    protected openUpdatePopup() {
        this.updatePopup().openPopup();
    }

    protected updateProject(event: WithFile<ProjectDetails>) {
        this.projectService.updateProject(event.data).subscribe(res => {
            this.getProject();
        });
    }

    private getProject() {
        if (this.projectName == null) return;

        this.projectService.getProject(this.projectName).subscribe({
            next: res => {
                this.project.set(res);
            }
        });
    }
}
