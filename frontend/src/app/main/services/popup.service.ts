import {inject, Injectable, TemplateRef} from '@angular/core';
import {PopupDialogComponent} from "../components/all/popups/popup-dialog/popup-dialog.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PopupResultType} from "../dto/all/PopupResultType";

@Injectable({
    providedIn: 'root'
})
export class PopupService {
    private modalService = inject(NgbModal);

    public createPopup(title: string,
                bodyTemplate: TemplateRef<any>,
                callback: (success: PopupResultType) => void,
                submitValidator?: () => boolean,
                submitText?: string,
                discardText?: string,
                cancelText?: string) {
        const modalRef = this.modalService.open(PopupDialogComponent);

        //set popup inputs
        modalRef.componentInstance.formId.set(`form-${crypto.randomUUID()}`);
        modalRef.componentInstance.title.set(title);

        if (submitText) modalRef.componentInstance.submitText.set(submitText);
        if (discardText) modalRef.componentInstance.discardText.set(discardText);
        if (cancelText) modalRef.componentInstance.cancelText.set(cancelText);

        if (submitValidator) modalRef.componentInstance.submitValidator.set(submitValidator);
        modalRef.componentInstance.bodyTemplate.set(bodyTemplate);

        modalRef.result.then(
            (res) => {
                callback(res as PopupResultType);
            },
            (res) => {
                callback(res as PopupResultType);
            }
        );
    }
}
