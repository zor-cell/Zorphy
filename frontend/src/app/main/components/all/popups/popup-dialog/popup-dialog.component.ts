import {Component, inject, signal, TemplateRef} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {NgTemplateOutlet} from "@angular/common";
import {PopupResultType} from "../../../../dto/all/PopupResultType";
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from "@angular/material/dialog";

export interface PopupData {
    formId: string;
    bodyTemplate: TemplateRef<any>;
    submitValidator?: () => boolean;
    title: string;
    cancelText: string;
    submitText: string;
    discardText?: string;
}

@Component({
    selector: 'app-popup-dialog',
    imports: [
        ReactiveFormsModule,
        NgTemplateOutlet,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions
    ],
    templateUrl: './popup-dialog.component.html',
    styleUrl: './popup-dialog.component.css'
})
export class PopupDialogComponent {
    protected data = inject<PopupData>(MAT_DIALOG_DATA);
    private dialogRef = inject(MatDialogRef<PopupDialogComponent>);

    protected get valid() {
        const validator = this.data.submitValidator;
        return validator ? validator() : true;
    }

    protected cancel() {
        this.dialogRef.close(PopupResultType.CANCEL)
    }

    protected discard() {
        this.dialogRef.close(PopupResultType.DISCARD);
    }

    protected submit() {
        if (this.valid) {
            this.dialogRef.close(PopupResultType.SUBMIT);
        }
    }
}
