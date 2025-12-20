import {Component, HostListener, inject, OnInit, viewChild} from '@angular/core';
import {RouterLink} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {LoginPopupComponent} from "../popups/login-popup/login-popup.component";
import {UserLoginDetails} from "../../../dto/all/UserLoginDetails";

@Component({
    selector: 'app-header',
    imports: [
        RouterLink,
        LoginPopupComponent
    ],
    
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
    protected authService = inject(AuthService);

    private loginPopup = viewChild.required<LoginPopupComponent>('loginPopup');

    protected mobileMenuOpen = false;

    // Close menu when clicking outside
    @HostListener('document:click', ['$event'])
    protected handleOutsideClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const header = document.querySelector('header');
        if (this.mobileMenuOpen && header && !header.contains(target)) {
            this.mobileMenuOpen = false;
        }
    }

    ngOnInit() {
        this.mobileMenuOpen = false;

        this.authService.loadUser().subscribe({
            next: res => {

            }
        })
    }

    protected toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
    }

    protected closeMobileMenu() {
        this.mobileMenuOpen = false;
    }

    protected openLoginPopup() {
        this.loginPopup().openPopup();
    }

    protected login(user: UserLoginDetails) {
        this.authService.login(user).subscribe(res => {
            window.location.reload();
        });
    }

    protected logout() {
        this.authService.logout().subscribe(res => {
            window.location.reload();
        })
    }
}
