import {Component, effect, inject, input, signal, viewChild} from "@angular/core";
import {MainHeaderComponent} from "../../../main/core/components/main-header/main-header.component";

import {AuthService} from "../../../main/core/services/auth.service";
import {GameStateBase} from "../dto/GameStateBase";
import {GameConfigBase} from "../dto/GameConfigBase";
import {GameSessionService} from "../services/http/game-session.service";
import {ResultState} from "../../../main/core/dto/result/ResultState";
import {GameSessionSavePopupComponent} from "./popups/save-popup/save-popup.component";
import {WithFile} from "../../../main/core/dto/WithFile";

@Component({
    selector: 'game-session-game',
    imports: [
    MainHeaderComponent,
    GameSessionSavePopupComponent
],
    
    template: `
        <app-main-header>
          @if (authService.isAdmin() && canSave()) {
            <button [disabled]="isSaved()" class="btn btn-primary" (click)="openSavePopup()">
              <i class="bi bi-floppy"></i>
            </button>
          }
        </app-main-header>
        
        <ng-content></ng-content>
        
        @if (gameState()) {
          <game-session-save-popup #savePopup
            [teams]="gameState().gameConfig.teams"
            [showFileUpload]="showFileUpload()"
            [scores]="scores()"
            (saveSessionEvent)="saveSession($event)"
            />
        }
        `
})
export class GameSessionGameComponent {
    protected authService = inject(AuthService);

    protected savePopup = viewChild.required<GameSessionSavePopupComponent>('savePopup')

    public sessionService = input.required<GameSessionService<GameConfigBase, GameStateBase>>();
    public gameState = input.required<GameStateBase>();

    public canSave = input<boolean>(true);
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