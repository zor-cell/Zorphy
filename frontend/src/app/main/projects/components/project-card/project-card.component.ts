import {Component, input} from '@angular/core';
import {ProjectMetadata} from "../../dto/ProjectMetadata";
import {DatePipe} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'project-card',
    imports: [
    RouterLink,
    DatePipe
],
    templateUrl: './project-card.component.html',
    
    styleUrl: './project-card.component.css'
})
export class ProjectCardComponent {
    public project = input.required<ProjectMetadata>();
}
