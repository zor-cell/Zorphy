import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {ProjectMetadata} from "./dto/ProjectMetadata";
import {ProjectDetails} from "./dto/ProjectDetails";
import {environment} from "../../../environments/environment";
import {NotificationService} from "../core/services/notification.service";

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private httpClient = inject(HttpClient);
    private notification = inject(NotificationService);

    private readonly baseUri = environment.httpApiUrl + '/projects';

    getProjects(): Observable<ProjectMetadata[]> {
        return this.httpClient.get<ProjectMetadata[]>(this.baseUri);
    }

    getProject(name: string): Observable<ProjectDetails> {
        return this.httpClient.get<ProjectDetails>(`${this.baseUri}/${name}`);
    }

    updateProject(project: ProjectDetails) {
        return this.httpClient.put<ProjectDetails>(this.baseUri, project).pipe(
            tap(() => {
                this.notification.handleSuccess('Updated project');
            })
        );
    }

    createProject(project: ProjectDetails, imageFile: File | null = null) {
        const formData = new FormData();
        formData.append('project', new Blob([JSON.stringify(project)], { type: 'application/json' }));
        if (imageFile) {
            formData.append('image', imageFile, imageFile.name);
        }

        return this.httpClient.post<ProjectDetails>(this.baseUri, formData).pipe(
            tap(() => {
                this.notification.handleSuccess('Created project');
            })
        );
    }
}
