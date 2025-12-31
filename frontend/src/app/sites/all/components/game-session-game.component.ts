import {Component, computed, effect, inject, input, signal, viewChild} from "@angular/core";
import {MainHeaderComponent} from "../../../main/core/components/main-header/main-header.component";

import {AuthService} from "../../../main/core/services/auth.service";
import {GameStateBase} from "../dto/GameStateBase";
import {GameConfigBase} from "../dto/GameConfigBase";
import {GameSessionService} from "../services/http/game-session.service";
import {ResultState} from "../../../main/core/dto/result/ResultState";
import {GameSessionSavePopupComponent} from "./popups/save-popup/save-popup.component";
import {WithFile} from "../../../main/core/dto/WithFile";
import {SavableGameState} from "../dto/SavableGameState";
import {PausableGameState} from "../dto/PausableGameState";
import {state} from "@angular/animations";

@Component({
    selector: 'game-session-game',
    imports: [
    MainHeaderComponent,
    GameSessionSavePopupComponent
],
    styles: [`
        .game-wrapper {
            position: relative;
            display: block;
        }

        .pause-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(4px);
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            pointer-events: all;
            cursor: not-allowed;
        }

        .pause-content {
            text-align: center;
            font-size: 2rem;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.2rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
    `],
    template: `
        <app-main-header>
          @if(canPause()) {
              @if(!isPaused()) {
                  <button class="btn btn-primary" (click)="pauseSession()">
                      <i class="bi bi-pause-circle"></i>
                  </button>      
              } @else {
                  <button class="btn btn-primary" (click)="resumeSession()">
                      <i class="bi bi-play-circle"></i>
                  </button>
              }
          }
            
          @if (authService.isAdmin() && canSave()) {
            <button [disabled]="isSaved()" class="btn btn-primary" (click)="openSavePopup()">
              <i class="bi bi-floppy"></i>
            </button>
          }
        </app-main-header>
        
        <div class="game-wrapper">
            <ng-content></ng-content>
            
            @if(isPaused()) {
                <div class="pause-overlay">
                    <div class="pause-content">
                        <i class="bi bi-pause-fill"></i> Game Paused
                    </div>
                </div>
            }    
        </div>
        
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
export class GameSessionGameComponent<
  Config extends GameConfigBase = GameConfigBase,
  State extends GameStateBase & SavableGameState & PausableGameState = any
> {
    protected authService = inject(AuthService);

    protected savePopup = viewChild.required<GameSessionSavePopupComponent>('savePopup')

    public sessionService = input.required<GameSessionService<Config, State>>();
    public gameState = input.required<State>();

    public canSave = input<boolean>(true);
    public canPause = input<boolean>(true);
    public showFileUpload = input<boolean>(true);
    public scores = input<Record<string, number>>();

    protected state = signal<State | null>(null);
    protected isSaved = computed(() => {
        const state = this.state();
        return !state ? false : state.isSaved;
    })
    protected isPaused = computed(() => {
       const state = this.state();
       if(!state || state.pauseEntries.length === 0) return false;

       const last = state.pauseEntries[state.pauseEntries.length - 1];
       return last.resumeTime === null;
    });

    constructor() {
        effect(() => {
            this.getSession();
        });
    }

    protected openSavePopup() {
        this.savePopup().openPopup();
    }

    protected getSession() {
        this.sessionService().getSession().subscribe(res => {
            this.state.set(res);
        });
    }

    protected saveSession(event: WithFile<ResultState>) {
        this.sessionService().saveSession(event.data, event.file).subscribe({
            next: res => {
                this.getSession();
            }
        });
    }

    protected pauseSession() {
        this.sessionService().pauseSession().subscribe(res => {
            this.state.set(res);
        });
    }

    protected resumeSession() {
        this.sessionService().resumeSession().subscribe(res => {
            this.state.set(res);
        });
    }
}