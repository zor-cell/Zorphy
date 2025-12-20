import {Component, inject, input, OnInit, output, signal, TemplateRef, viewChild} from '@angular/core';
import {PopupService} from "../../../../services/popup.service";
import {PopupResultType} from "../../../../dto/all/PopupResultType";
import {ProjectDetails} from "../../../../dto/projects/ProjectDetails";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { DatePipe } from "@angular/common";
import {FileUpload} from "../../../../dto/all/FileUpload";
import {FileUploadComponent} from "../../../all/file-upload/file-upload.component";
import {WithFile} from "../../../../dto/all/WithFile";

type ProjectForm = FormGroup<{
    name: FormControl<string>;
    createdAt: FormControl<Date>;
    title: FormControl<string>;
    description: FormControl<string>;
    imagePath: FormControl<string | null>;
    githubUrl: FormControl<string | null>;
    hasWebsite: FormControl<boolean>;
    isFavorite: FormControl<boolean>;
    filePath: FormControl<string>;
}>;

@Component({
    selector: 'project-update-popup',
    imports: [
    ReactiveFormsModule,
    DatePipe,
    FileUploadComponent
],
    templateUrl: './update-popup.component.html',
    standalone: true,
    styleUrl: './update-popup.component.css'
})
export class ProjectUpdatePopupComponent implements OnInit {
    private popupService = inject(PopupService);
    private fb = inject(FormBuilder);

    private updateTemplate = viewChild.required<TemplateRef<any>>('updatePopup');
    public project = input<ProjectDetails | null>(null);
    public updateProjectEvent = output<WithFile<ProjectDetails>>();

    protected readonly filePathPrefix = 'projects/';
    protected readonly imagePathPrefix = 'projects/';
    protected fileUpload = signal<FileUpload>(new FileUpload());
    protected projectForm: ProjectForm = this.fb.group({
        name: this.fb.nonNullable.control('', {validators: Validators.required}),
        createdAt: this.fb.nonNullable.control(new Date(), {validators: Validators.required}),
        title: this.fb.nonNullable.control('', {validators: Validators.required}),
        description: this.fb.nonNullable.control('', {validators: Validators.required}),
        imagePath: this.fb.control<string | null>(null),
        githubUrl: this.fb.control<string | null>(null),
        hasWebsite: this.fb.nonNullable.control(false, {validators: Validators.required}),
        isFavorite: this.fb.nonNullable.control(false, {validators: Validators.required}),
        filePath: this.fb.nonNullable.control('', {validators: Validators.required}),
    });

    ngOnInit() {
        const project = this.project();
        if (project != null) {
            const filePath = project.filePath.startsWith(this.filePathPrefix) ? project.filePath.substring(this.filePathPrefix.length) : project.filePath;

            const url = project.metadata.imagePath;
            let imagePath = null;
            if(url && url.length > 0) {
                if(url.includes("static")) {
                    imagePath = null;
                } else {
                    imagePath = url.includes(this.imagePathPrefix) ? url.substring(url.indexOf(this.imagePathPrefix) + this.imagePathPrefix.length) : url;
                }
            }

            this.projectForm.patchValue({
                name: project.metadata.name,
                createdAt: project.metadata.createdAt,
                title: project.metadata.title,
                description: project.metadata.description,
                imagePath: imagePath,
                githubUrl: project.metadata.githubUrl,
                hasWebsite: project.metadata.hasWebsite,
                isFavorite: project.metadata.isFavorite,
                filePath: filePath
            });
        }

        //TODO: shouldnt really be disabled
        this.projectForm.controls.createdAt.disable();
    }

    public openPopup() {
        const isUpdate = this.project() != null;

        this.popupService.createPopup(
            isUpdate ? 'Update Project' : 'Create Project',
            this.updateTemplate(),
            this.callback.bind(this),
            () => this.projectForm.valid && !this.configsAreEqual(),
            isUpdate ? 'Update' : 'Create',
        );
    }

    private callback(result: PopupResultType) {
        if (result === PopupResultType.SUBMIT) {
            this.updateProject();
        }
        this.projectForm.reset();
    }

    private formToDetails() {
        const value = this.projectForm.getRawValue();
        const project: ProjectDetails = {
            metadata: {
                name: value.name,
                createdAt: value.createdAt,
                title: value.title,
                description: value.description,
                imagePath: value.imagePath ? this.imagePathPrefix + value.imagePath : value.imagePath,
                githubUrl: value.githubUrl,
                hasWebsite: value.hasWebsite,
                isFavorite: value.isFavorite
            },
            content: '',
            filePath: this.filePathPrefix + value.filePath
        };

        return project;
    }

    private updateProject() {
        const project = this.formToDetails();
        this.updateProjectEvent.emit({
            data: project,
            file: this.fileUpload().getAndRevokeFile()
        });
    }

    //TODO: update on equal configs, not so easy
    private configsAreEqual(): boolean {
        //compare without content
        /*const { content: _pContent, ...project } = this.project();
        const { content: _fContent, ...form } = this.formToDetails();

        console.log(JSON.stringify(project))
        console.log(JSON.stringify(form))

        return JSON.stringify(project) === JSON.stringify(form);*/
        return false;
    }
}
