import {Component, forwardRef, inject, input, OnInit, output, signal, TemplateRef, viewChild} from '@angular/core';
import {PopupService} from "../../../../../main/core/services/popup.service";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FileUploadComponent} from "../../../../../main/core/components/file-upload/file-upload.component";
import {PopupResultType} from "../../../../../main/core/dto/PopupResultType";
import {Team} from "../../../../../main/core/dto/Team";
import {WithFile} from "../../../../../main/core/dto/WithFile";
import {FileUpload} from "../../../../../main/core/dto/FileUpload";
import {DuelResultState} from "../../../dto/result/DuelResultState";
import {DuelResultTeamState} from "../../../dto/result/DuelResultTeamState";
import {GameSavePopupBase} from "../../../../core/http/directives/game-save-popup-base.directive";
import {callback} from "chart.js/helpers";

interface DuelSaveForm {
  score: FormControl<number | null>;
  blueCardScore: FormControl<number | null>;
  greenCardScore: FormControl<number | null>;
  yellowCardScore: FormControl<number | null>;
  purpleCardScore: FormControl<number | null>;
  wonderScore: FormControl<number | null>;
  developmentScore: FormControl<number | null>;
  coinScore: FormControl<number | null>;
  warScore: FormControl<number | null>;
  wonWithWar: FormControl<boolean | null>;
  wonWithDevelopment: FormControl<boolean | null>;
}

@Component({
  selector: 'seven-wonders-duel-save-popup',
  imports: [
    FileUploadComponent,
    ReactiveFormsModule
  ],
  providers: [{provide: GameSavePopupBase, useExisting: forwardRef(() => DuelSavePopupComponent)}],
  templateUrl: './duel-save-popup.component.html',
  styleUrl: './duel-save-popup.component.css',
})
export class DuelSavePopupComponent extends GameSavePopupBase<DuelResultState> implements OnInit {
  private popupService = inject(PopupService);
  private fb = inject(FormBuilder);

  private saveTemplate = viewChild.required<TemplateRef<any>>('duelSavePopup');
  public teams = input.required<Team[]>();

  protected saveForm!: FormGroup<Record<string, FormGroup<DuelSaveForm>>>;
  protected fileUpload = signal<FileUpload>(new FileUpload());

  ngOnInit() {
    const group: Record<string, FormGroup<DuelSaveForm>> = {};

    for(let team of this.teams()) {
      group[team.name] = this.fb.group({
        score: this.fb.control<number | null>(null, {validators: Validators.required}),
        blueCardScore: this.fb.control<number | null>(null, {validators: Validators.required}),
        greenCardScore: this.fb.control<number | null>(null, {validators: Validators.required}),
        yellowCardScore: this.fb.control<number | null>(null, {validators: Validators.required}),
        purpleCardScore: this.fb.control<number | null>(null, {validators: Validators.required}),
        wonderScore: this.fb.control<number | null>(null, {validators: Validators.required}),
        developmentScore: this.fb.control<number | null>(null, {validators: Validators.required}),
        coinScore: this.fb.control<number | null>(null, {validators: Validators.required}),
        warScore: this.fb.control<number | null>(null, {validators: Validators.required}),
        wonWithWar: this.fb.control<boolean | null>(null),
        wonWithDevelopment: this.fb.control<boolean | null>(null)
      });
    }

    this.saveForm = this.fb.group(group);
  }

  public openPopup() {
    this.popupService.createPopup(
      'Save Game Data',
      this.saveTemplate(),
      this.callback.bind(this),
      () => true, //this.saveForm.valid, TODO: reuse in prod
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

    const teamState: DuelResultTeamState[] = this.teams().map(team => ({
      team: team,
      score: Number(formValue[team.name].score),
      blueCardScore: Number(formValue[team.name].blueCardScore),
      greenCardScore: Number(formValue[team.name].greenCardScore),
      yellowCardScore: Number(formValue[team.name].yellowCardScore),
      purpleCardScore: Number(formValue[team.name].purpleCardScore),
      wonderScore: Number(formValue[team.name].wonderScore),
      developmentScore: Number(formValue[team.name].developmentScore),
      coinScore: Number(formValue[team.name].coinScore),
      warScore: Number(formValue[team.name].warScore),
      wonWithWar: Boolean(formValue[team.name].wonWithWar),
      wonWithDevelopment: Boolean(formValue[team.name].wonWithDevelopment)
    }));

    this.saveSessionEvent.emit({
      data: {
        teams: teamState
      },
      file: this.fileUpload().getAndRevokeFile()
    });
  }
}
