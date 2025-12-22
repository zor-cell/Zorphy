import {Component, inject, input, OnInit, output, signal, TemplateRef, viewChild} from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    ValidatorFn,
    Validators
} from "@angular/forms";
import {Team} from "../../../../../main/core/dto/Team";
import {PopupService} from "../../../../../main/core/services/popup.service";
import {PopupResultType} from "../../../../../main/core/dto/PopupResultType";

import {RoundResult} from "../../../dto/RoundResult";
import {FileUpload} from "../../../../../main/core/dto/FileUpload";
import {FileUploadComponent} from "../../../../../main/core/components/file-upload/file-upload.component";
import {WithFile} from "../../../../../main/core/dto/WithFile";
import {RoundInfo} from "../../../dto/RoundInfo";

interface RoundForm {
  score: FormControl<number | null>;
  hasClosed: FormControl<boolean>;
  outInOne: FormControl<boolean>;
}


@Component({
  selector: 'jolly-round-popup',
  imports: [
    ReactiveFormsModule,
    FileUploadComponent
],
  templateUrl: './round-popup.component.html',
  
  styleUrl: './round-popup.component.css'
})
export class RoundPopupComponent implements OnInit {
  private popupService = inject(PopupService);
  private fb = inject(FormBuilder);

  public teams = input.required<Team[]>();
  public rounds = input<RoundInfo[] | null>(null);
  public addRoundEvent = output<WithFile<RoundResult[]>>();
  public updateRoundEvent = output<{data: WithFile<RoundResult[]>, roundIndex: number}>();

  protected saveForm!: FormGroup<Record<string, FormGroup<RoundForm>>>;
  protected fileUpload = signal<FileUpload>(new FileUpload());

  private saveTemplate = viewChild.required<TemplateRef<any>>('roundPopup');
  private roundIndex = signal<number>(0);


  ngOnInit() {
    const group: Record<string, FormGroup<RoundForm>> = {};

    for (let team of this.teams()) {
      group[team.name] = this.fb.group({
        score: this.fb.control<number | null>(null, {validators: Validators.required}),
        hasClosed: this.fb.control<boolean>(false, {nonNullable: true}),
        outInOne: this.fb.control<boolean>(false, {nonNullable: true})
      });
    }

    this.saveForm = this.fb.group(group, {validators: [this.allScoresValidator, this.exactlyOneClosedValidator]});

    //validation
    for(let team of this.teams()) {
      const teamGroup = this.saveForm.controls[team.name].controls;
      teamGroup.outInOne.disable();

      teamGroup.hasClosed.valueChanges.subscribe(value => {
        if(value) {
          teamGroup.outInOne.enable();

          // Uncheck all other hasClosed
          for (let other of this.teams()) {
            if (other.name !== team.name) {
              this.saveForm.controls[other.name].controls.hasClosed.setValue(false, {emitEvent: false});
              this.saveForm.controls[other.name].controls.outInOne.setValue(false, {emitEvent: false});
              this.saveForm.controls[other.name].controls.outInOne.disable();
            }
          }
        } else {
          teamGroup.outInOne.setValue(false, {emitEvent: false});
          teamGroup.outInOne.disable();
        }
      });
    }
  }

  public openPopup(roundIndex: number | null = null) {
    //init values if in edit mode
    const rounds = this.rounds();
    if(rounds && roundIndex != null && roundIndex >= 0 && roundIndex < rounds.length) {
      const round = rounds[roundIndex];

      for(let result of round.results) {
        const formControl = this.saveForm.controls[result.team.name];
        formControl.patchValue({
          score: result.score,
          hasClosed: result.hasClosed,
          outInOne: result.outInOne
        });
      }

      this.roundIndex.set(roundIndex);
    }

    this.popupService.createPopup(
        this.rounds() ? 'Edit Round' : 'Add Round',
        this.saveTemplate(),
        this.callback.bind(this),
        () => this.saveForm.valid,
        this.rounds() ? 'Edit' : 'Add'
    );
  }

  private callback(result: PopupResultType) {
    if (result === PopupResultType.SUBMIT) {
        this.saveOrUpdateRound();
    } else if (result === PopupResultType.CANCEL) {
      this.saveForm.reset();
    }
    this.saveForm.reset();
  }

  private saveOrUpdateRound() {
    const formValue = this.saveForm.getRawValue();

    const roundResults: RoundResult[] = this.teams().map(team => ({
      team: team,
      score: Number(formValue[team.name].score),
      hasClosed: formValue[team.name].hasClosed,
      outInOne: formValue[team.name].outInOne
    }));

    if(this.rounds()) {
      this.updateRoundEvent.emit({
        data: {
          data: roundResults,
          file: this.fileUpload().getAndRevokeFile(),
        },
        roundIndex: this.roundIndex()
      })
    } else {
      this.addRoundEvent.emit({
        data: roundResults,
        file: this.fileUpload().getAndRevokeFile()
      });
    }
  }


  // Make sure all scores are filled in
  private allScoresValidator: ValidatorFn = (control: AbstractControl) => {
    const group = control as FormGroup;

    const allValid = Object.values(group.controls).every(ctrl => {
      const fg = ctrl as FormGroup;
      return fg.get('score')?.value !== null && fg.get('score')?.value !== '';
    });

    return allValid ? null : { missingScore: true };
  };

  // Make sure exactly one hasClosed = true
  private exactlyOneClosedValidator: ValidatorFn = (control: AbstractControl) => {
    const group = control as FormGroup;

    const closedCount = Object.values(group.controls).filter(ctrl => {
      const fg = ctrl as FormGroup;
      return fg.get('hasClosed')?.value === true;
    }).length;

    return closedCount === 1 ? null : { invalidClosedCount: true };
  };

}
