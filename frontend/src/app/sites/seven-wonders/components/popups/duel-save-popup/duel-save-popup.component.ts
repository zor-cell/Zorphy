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
  scienceScore: FormControl<number | null>;
  coinScore: FormControl<number | null>;
  warScore: FormControl<number | null>;
  wonWithWar: FormControl<boolean>;
  wonWithScience: FormControl<boolean>;
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
        scienceScore: this.fb.control<number | null>(null, {validators: Validators.required}),
        coinScore: this.fb.control<number | null>(null, {validators: Validators.required}),
        warScore: this.fb.control<number | null>(null, {validators: Validators.required}),
        wonWithWar: this.fb.control<boolean>(false, {nonNullable: true}),
        wonWithScience: this.fb.control<boolean>(false, {nonNullable: true})
      });
    }

    this.saveForm = this.fb.group(group);

    //form value logic
    for (let team of this.teams()) {
      const teamGroup = this.saveForm.get(team.name) as FormGroup<DuelSaveForm>;

      const sub = teamGroup.valueChanges.subscribe(val => {
        const disableNumbers = (val.wonWithWar || val.wonWithScience);

        //toggle visibility when instant win occurs
        if(disableNumbers !== undefined) {
          for (const team2 of this.teams()) {
            this.updateNumberInputs(team2, disableNumbers);
          }
        }

        // calculate the sum
        const rawVal = teamGroup.getRawValue();
        const total = (rawVal.blueCardScore || 0) +
          (rawVal.greenCardScore || 0) +
          (rawVal.yellowCardScore || 0) +
          (rawVal.purpleCardScore || 0) +
          (rawVal.wonderScore || 0) +
          (rawVal.scienceScore || 0) +
          (rawVal.coinScore || 0) +
          (rawVal.warScore || 0);

        if (teamGroup.controls.score.value !== total) {
          teamGroup.patchValue({score: total}, {emitEvent: false});
        }
      });
      this.formSubs.push(sub);

      //enforce that only one instant win can be checked at a time
      teamGroup.controls.wonWithWar.valueChanges.subscribe(value => {
        if(value) {
          teamGroup.controls.wonWithScience.setValue(false, {emitEvent: false});

          this.resetInstantWins(team);
        }
      });

      teamGroup.controls.wonWithScience.valueChanges.subscribe(value => {
        if(value) {
          teamGroup.controls.wonWithWar.setValue(false, {emitEvent: false});

          this.resetInstantWins(team);
        }
      });
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
      scienceScore: Number(formValue[team.name].scienceScore),
      coinScore: Number(formValue[team.name].coinScore),
      warScore: Number(formValue[team.name].warScore),
      wonWithWar: Boolean(formValue[team.name].wonWithWar),
      wonWithScience: Boolean(formValue[team.name].wonWithScience)
    }));

    this.saveSessionEvent.emit({
      data: {
        teams: teamState
      },
      file: this.fileUpload().getAndRevokeFile()
    });
  }

  private updateNumberInputs(team: Team, disable: boolean) {
    const group = this.saveForm.controls[team.name];
    Object.values(group.controls).forEach(control => {
      if (control !== group.controls.wonWithWar && control !== group.controls.wonWithScience) {
        if(disable) {
          control.disable({ emitEvent: false });
        } else {
          control.enable({ emitEvent: false });
        }
      }
    });
  }

  private resetInstantWins(team: Team) {
    for (let other of this.teams()) {
      if (other.name !== team.name) {
        this.saveForm.controls[other.name].controls.wonWithWar.setValue(false, {emitEvent: false});
        this.saveForm.controls[other.name].controls.wonWithScience.setValue(false, {emitEvent: false});
      }
    }
  }
}
