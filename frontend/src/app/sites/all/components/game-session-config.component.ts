import {Component, inject, input, model, OnInit, signal, viewChild} from "@angular/core";
import {MainHeaderComponent} from "../../../main/components/all/main-header/main-header.component";
import {GameSessionService} from "../services/http/game-session.service";
import {Router} from "@angular/router";
import {GameSessionClearPopupComponent} from "./popups/clear-popup/clear-popup.component";
import {GameSessionUpdatePopupComponent} from "./popups/update-popup/update-popup.component";
import {GameConfigBase} from "../dto/GameConfigBase";
import {GameStateBase} from "../dto/GameStateBase";

@Component({
    selector: 'game-session-config',
    imports: [
        MainHeaderComponent,
        GameSessionClearPopupComponent,
        GameSessionUpdatePopupComponent
    ],
    
    template: `
        <app-main-header>
            @if (!hasSession()) {
                <button class="btn btn-primary" (click)="startGame()" [disabled]="!isValidConfig()">
                    <i class="bi bi-play-circle"></i>
                </button>
            } @else {
                <button class="btn btn-outline-danger" (click)="openClearPopup()">
                    <i class="bi bi-database-fill-x"></i>
                </button>
                <button class="btn btn-outline-primary" (click)="continueGame()">
                    <i class="bi bi-play-circle"></i>
                </button>
            }
        </app-main-header>

        <ng-content></ng-content>

        <game-session-clear-popup #clearPopup
                                  (clearSessionEvent)="clearSession()"/>
        <game-session-update-popup #updatePopup
                                   [canUpdate]="isValidConfig()"
                                   (updateSessionEvent)="updateSession($event)"/>
    `
})
export class GameSessionConfigComponent implements OnInit {
    private clearPopup = viewChild.required<GameSessionClearPopupComponent>('clearPopup');
    private updatePopup = viewChild.required<GameSessionUpdatePopupComponent>('updatePopup');

    public sessionService = input.required<GameSessionService<GameConfigBase, GameStateBase>>();
    public projectName = input.required<string>();
    public isValidConfig = input.required<boolean>();
    public gameConfig = model.required<GameConfigBase>();
    protected hasSession = signal<boolean>(false);

    //to check for changes on update
    private originalConfig: GameConfigBase | null = null;

    private router = inject(Router);

    ngOnInit() {
        this.sessionService().getSession().subscribe(res => {
            this.hasSession.set(true);
            this.gameConfig.set(res.gameConfig);

            this.originalConfig = structuredClone(this.gameConfig());
        });
    }

    protected startGame() {
        if(this.hasSession()) return;

        this.sessionService().createSession(this.gameConfig()).subscribe(res => {
            this.goToGame();
        });
    }

    protected continueGame() {
        if (!this.hasSession || this.originalConfig === null) return;
        //only show popup if changes to the config have been made
        if (this.configsAreEqual(this.gameConfig(), this.originalConfig)) {
            this.goToGame();
        } else {
            this.openUpdatePopup();
        }
    }

    protected goToGame() {
        this.router.navigate([`projects/${this.projectName()}/game`]);
    }

    protected openClearPopup() {
        this.clearPopup().openPopup();
    }

    protected openUpdatePopup() {
        this.updatePopup().openPopup();
    }

    protected clearSession() {
        this.sessionService().clearSession().subscribe({
            next: res => {
                this.hasSession.set(false);
            }
        });
    }

    protected updateSession(submit: boolean) {
        if(submit) {
            this.sessionService().updateSession(this.gameConfig()).subscribe({
                next: res => {
                    this.goToGame();
                }
            });
        } else {
            this.goToGame();
        }
    }

    private configsAreEqual(config1: GameConfigBase, config2: GameConfigBase): boolean {
        return JSON.stringify(config1) === JSON.stringify(config2);
    }
}