import {Component, inject, OnInit, output, TemplateRef, viewChild} from '@angular/core';
import {
    FormsModule,
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators
} from "@angular/forms";
import {PopupService} from "../../../../services/popup.service";
import {UserLoginDetails} from "../../../../dto/all/UserLoginDetails";
import {PopupResultType} from "../../../../dto/all/PopupResultType";

@Component({
    selector: 'app-login-popup',
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './login-popup.component.html',
    
    styleUrl: './login-popup.component.css'
})
export class LoginPopupComponent {
    private popupService = inject(PopupService);
    private fb = inject(NonNullableFormBuilder);

    private loginTemplate = viewChild.required<TemplateRef<any>>('loginPopup');
    public loginEvent = output<UserLoginDetails>();

    protected loginForm = this.fb.group({
        username: this.fb.control('', Validators.required),
        password: this.fb.control('', Validators.required)
    });

    public openPopup() {
        this.popupService.createPopup(
            'Login',
            this.loginTemplate(),
            this.callback.bind(this),
            () => this.loginForm.valid,
            'Login');
    }

    private callback(result: PopupResultType) {
        if (result === PopupResultType.SUBMIT) {
            const user = this.loginForm.getRawValue() as UserLoginDetails;
            this.loginEvent.emit(user);
        }

        this.loginForm.reset();
    }
}
