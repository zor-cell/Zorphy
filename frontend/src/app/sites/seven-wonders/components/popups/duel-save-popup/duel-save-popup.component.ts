import {
  Component,
  forwardRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
  TemplateRef,
  viewChild
} from '@angular/core';
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
import {Subscription} from "rxjs";

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
  wonWithWar: FormControl<boolean>;
  wonWithDevelopment: FormControl<boolean>;
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
export class DuelSavePopupComponent extends GameSavePopupBase<DuelResultState> implements OnInit, OnDestroy {
  private popupService = inject(PopupService);
  private fb = inject(FormBuilder);

  private saveTemplate = viewChild.required<TemplateRef<any>>('duelSavePopup');
  public teams = input.required<Team[]>();

  private formSubs: Subscription[] = [];
  protected saveForm!: FormGroup<Record<string, FormGroup<DuelSaveForm>>>;
  protected fileUpload = signal<FileUpload>(new FileUpload());

  ngOnInit() {
    const group: Record<string, FormGroup<DuelSaveForm>> = {};

    for (let team of this.teams()) {
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
        wonWithWar: this.fb.control<boolean>(false, {nonNullable: true}),
        wonWithDevelopment: this.fb.control<boolean>(false, {nonNullable: true})
      });
    }

    this.saveForm = this.fb.group(group);

    //form value logic
    for (let team of this.teams()) {
      const teamGroup = this.saveForm.get(team.name) as FormGroup<DuelSaveForm>;

      const sub = teamGroup.valueChanges.subscribe(val => {
        if (val.wonWithWar || val.wonWithDevelopment) {
          if (teamGroup.get('score')?.value !== 0) {
            this.disableNumberInputs(teamGroup);
          }
        } else {
          this.enableNumberInputs(teamGroup);
        }

        // calculate the sum
        const total = (val.blueCardScore || 0) +
          (val.greenCardScore || 0) +
          (val.yellowCardScore || 0) +
          (val.purpleCardScore || 0) +
          (val.wonderScore || 0) +
          (val.developmentScore || 0) +
          (val.coinScore || 0) +
          (val.warScore || 0);

        if (teamGroup.get('score')?.value !== total) {
          teamGroup.patchValue({score: total}, {emitEvent: false});
        }
      });
      this.formSubs.push(sub);
    }
  }

  ngOnDestroy(): void {
    this.formSubs.forEach(sub => sub.unsubscribe());
  }

  public openPopup() {
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

    const teamState: DuelResultTeamState[] = this.teams().map(team => ({
      team: team,
      score: Number(formValue[team.name].score),
      blueCardScore: Number(formValue[team.name].blueCardScore),
      greenCardScore: Number(formValue[team.name].greenCardScore),
      yellowCardScore: Number(formValue[team.name].yellowCardScore),
      purpleCardScore: Number(formValue[team.name].purpleCardScore),
      wonderScore: Number(formValue[team.name].wonderScore),
      scienceScore: Number(formValue[team.name].developmentScore),
      coinScore: Number(formValue[team.name].coinScore),
      warScore: Number(formValue[team.name].warScore),
      wonWithWar: Boolean(formValue[team.name].wonWithWar),
      wonWithScience: Boolean(formValue[team.name].wonWithDevelopment)
    }));

    this.saveSessionEvent.emit({
      data: {
        teams: teamState
      },
      file: this.fileUpload().getAndRevokeFile()
    });
  }

  private disableNumberInputs(group: FormGroup<DuelSaveForm>) {
    Object.keys(group.controls).forEach(key => {
      if (key !== 'wonWithWar' && key !== 'wonWithDevelopment') {
        group.controls[key as keyof DuelSaveForm].disable({ emitEvent: false });
      }
    });
  }

  private enableNumberInputs(group: FormGroup) {
    Object.keys(group.controls).forEach(key => {
      if (key !== 'wonWithWar' && key !== 'wonWithDevelopment') {
        group.controls[key as keyof DuelSaveForm].enable({ emitEvent: false });
      }
    });
  }
}
