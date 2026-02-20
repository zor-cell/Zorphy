import {inject, Injectable, TemplateRef} from '@angular/core';
import {PopupDialogComponent} from "../components/popups/popup-dialog/popup-dialog.component";
import {PopupResultType} from "../dto/PopupResultType";
import {MatDialog} from "@angular/material/dialog";

@Injectable({
    providedIn: 'root'
})
export class PopupService {
    private dialog = inject(MatDialog);

    public createPopup(title: string,
                bodyTemplate: TemplateRef<any>,
                callback: (success: PopupResultType) => void,
                submitValidator?: () => boolean,
                submitText?: string,
                discardText?: string,
                cancelText?: string) {
        const dialogRef = this.dialog.open(PopupDialogComponent, {
            width: '500px',
            autoFocus: 'first-tabbable',
            data: {
                formId: `form-${crypto.randomUUID()}`,
                title: title,
                bodyTemplate: bodyTemplate,
                submitText: submitText ?? 'Submit',
                discardText: discardText,
                cancelText: cancelText ?? 'Cancel',
                submitValidator: submitValidator
            }
        });

        dialogRef.afterClosed().subscribe((res) => {
            callback(res ?? PopupResultType.CANCEL);
        });
    }
}
