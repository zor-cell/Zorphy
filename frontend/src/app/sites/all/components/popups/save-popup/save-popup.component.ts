import {Component, inject, input, OnInit, output, signal, TemplateRef, viewChild} from '@angular/core';

import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Team} from "../../../../../main/dto/all/Team";
import {PopupService} from "../../../../../main/services/popup.service";
import {PopupResultType} from "../../../../../main/dto/all/PopupResultType";
import {ResultState} from "../../../../../main/dto/all/result/ResultState";
import {ResultTeamState} from "../../../../../main/dto/all/result/ResultTeamState";
import {FileUpload} from "../../../../../main/dto/all/FileUpload";
import {FileUploadComponent} from "../../../../../main/components/all/file-upload/file-upload.component";
import {WithFile} from "../../../../../main/dto/all/WithFile";

interface SaveForm {
    score: FormControl<number | null>;
}

@Component({
    selector: 'game-session-save-popup',
    imports: [
    ReactiveFormsModule,
    FileUploadComponent
],
    templateUrl: './save-popup.component.html',
    standalone: true,
    styleUrl: './save-popup.component.css'
})
export class GameSessionSavePopupComponent implements OnInit {
    private popupService = inject(PopupService);
    private fb = inject(FormBuilder);

    private saveTemplate = viewChild.required<TemplateRef<any>>('savePopup');
    public teams = input.required<Team[]>();
    public scores = input<Record<string, number>>();
    public showFileUpload = input<boolean>(true);
    public saveSessionEvent = output<WithFile<ResultState>>();

    protected saveForm!: FormGroup<Record<string, FormGroup<SaveForm>>>;
    protected fileUpload = signal<FileUpload>(new FileUpload());

    ngOnInit() {
        const group: Record<string, FormGroup<SaveForm>> = {};

        for(let team of this.teams()) {
            group[team.name] = this.fb.group({
               score: this.fb.control<number | null>(null, {validators: Validators.required})
            });
        }

        this.saveForm = this.fb.group(group);
    }

    public openPopup() {
        //populate with scores if there are any
        if (this.scores()) {
            for (let team of this.teams()) {
                this.saveForm.controls[team.name].controls.score.setValue(this.scores()![team.name], {emitEvent: false});
            }
        }

        this.popupService.createPopup(
            'Save Game Data',
            this.saveTemplate(),
            this.callback.bind(this),
            () => this.saveForm.valid,
            'Save'
        );
    }

    private callback(result: PopupResultType) {
        if (result === PopupResultType.SUBMIT) {
            this.saveGame();
        }

        this.saveForm.reset();
        this.fileUpload().revokeFile();
    }

    private saveGame() {
        const formValue = this.saveForm.getRawValue();

        const teamState: ResultTeamState[] = this.teams().map(team => ({
            team: team,
            score: Number(formValue[team.name].score)
        }));

        this.saveSessionEvent.emit({
            data: {
                teams: teamState
            },
            file: this.fileUpload().getAndRevokeFile()
        });
    }
}
