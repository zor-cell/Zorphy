import {Component, inject, signal, TemplateRef} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import { NgTemplateOutlet } from "@angular/common";
import {PopupResultType} from "../../../../dto/all/PopupResultType";

@Component({
    selector: 'app-popup-dialog',
    imports: [
    ReactiveFormsModule,
    NgTemplateOutlet
],
    templateUrl: './popup-dialog.component.html',
    
    styleUrl: './popup-dialog.component.css'
})
export class PopupDialogComponent {
    private activeModal = inject(NgbActiveModal);

    public formId = signal<string | null>(null);
    public bodyTemplate = signal<TemplateRef<any> | null>(null);
    public submitValidator = signal<(() => boolean) | null>(null);
    public title = signal('Modal');
    public cancelText = signal('Cancel');
    public submitText = signal('Submit');
    public discardText = signal<string | null>(null);

    protected get valid() {
        const validator = this.submitValidator();
        return validator === null ? true : validator();
    }

    protected cancel() {
        this.activeModal.dismiss(PopupResultType.CANCEL)
    }

    protected discard() {
        this.activeModal.close(PopupResultType.DISCARD);
    }

    protected submit() {
        if (this.valid) {
            this.activeModal.close(PopupResultType.SUBMIT);
        }
    }
}
