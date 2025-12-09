import {Component, effect, inject, input, signal, viewChild} from "@angular/core";
import {MainHeaderComponent} from "../../../main/components/all/main-header/main-header.component";
import {NgIf} from "@angular/common";
import {AuthService} from "../../../main/services/auth.service";
import {GameStateBase} from "../dto/GameStateBase";
import {GameConfigBase} from "../dto/GameConfigBase";
import {GameSessionService} from "../game-session.service";
import {ResultState} from "../../../main/dto/all/result/ResultState";
import {GameSessionSavePopupComponent} from "./popups/save-popup/save-popup.component";
import {WithFile} from "../../../main/dto/all/WithFile";

@Component({
    selector: 'game-session-game',
    imports: [
        MainHeaderComponent,
        NgIf,
        GameSessionSavePopupComponent
    ],
    standalone: true,
    template: `
        <app-main-header>
            <button *ngIf="authService.isAdmin()" [disabled]="isSaved()" class="btn btn-primary" (click)="openSavePopup()">
                <i class="bi bi-floppy"></i>
            </button>
        </app-main-header>

        <ng-content></ng-content>

        <game-session-save-popup #savePopup
                                 *ngIf="gameState()"
                                 [teams]="gameState().gameConfig.teams"
                                 [showFileUpload]="showFileUpload()"
                                 [scores]="scores()"
                                 (saveSessionEvent)="saveSession($event)"
        />
    `
})
export class GameSessionGameComponent {
    protected authService = inject(AuthService);

    protected savePopup = viewChild.required<GameSessionSavePopupComponent>('savePopup')

    public sessionService = input.required<GameSessionService<GameConfigBase, GameStateBase>>();
    public gameState = input.required<GameStateBase>();

    public showFileUpload = input<boolean>(true);
    public scores = input<Record<string, number>>();

    protected isSaved = signal<boolean>(false);

    constructor() {
        effect(() => {
            this.isSessionSaved();
        });
    }

    protected openSavePopup() {
        this.savePopup().openPopup();
    }

    protected saveSession(event: WithFile<ResultState>) {
        this.sessionService().saveSession(event.data, event.file).subscribe({
            next: res => {
                this.isSessionSaved();
            }
        });
    }

    protected isSessionSaved() {
        this.sessionService().isSessionSaved().subscribe(res => {
            this.isSaved.set(res);
        });
    }
}