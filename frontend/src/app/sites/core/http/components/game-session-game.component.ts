import {Component, computed, contentChild, effect, inject, input, model, viewChild} from "@angular/core";
import {MainHeaderComponent} from "../../../../main/core/components/main-header/main-header.component";

import {AuthService} from "../../../../main/core/services/auth.service";
import {GameStateBase} from "../dto/GameStateBase";
import {GameConfigBase} from "../dto/GameConfigBase";
import {GameSessionService} from "../game-session.service";
import {GameSessionSavePopupComponent} from "./popups/save-popup/save-popup.component";
import {WithFile} from "../../../../main/core/dto/WithFile";
import {SavableGameState} from "../dto/SavableGameState";
import {PausableGameState} from "../dto/PausableGameState";
import {GameSavePopupBase} from "../directives/game-save-popup-base.directive";
import {ResultStateBase} from "../dto/result/ResultStateBase";

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

          transition: all 0.3s ease-in-out;
      }

      .pause-content {
          text-align: center;
          font-size: 2rem;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.2rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      }
  `],
  template: `
      <app-main-header>
          @if (canPause()) {
              @if (!isPaused()) {
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

          @if (isPaused()) {
              <div class="pause-overlay">
                  <div class="pause-content">
                      <i class="bi bi-pause-fill"></i> Game Paused
                  </div>
              </div>
          }
      </div>

      @if (gameState(); as state) {
          @if (!customSavePopup()) {
              <game-session-save-popup #defaultSavePopup
                                       [teams]="state.gameConfig.teams"
                                       [showFileUpload]="showFileUpload()"
                                       [scores]="scores()"
                                       (saveSessionEvent)="saveSession($event)"
              />
          }
      }

      <ng-content select="customSavePopup"/>
  `
})
export class GameSessionGameComponent<
  Config extends GameConfigBase,
  State extends GameStateBase & SavableGameState & PausableGameState
> {
  protected authService = inject(AuthService);

  protected defaultSavePopup = viewChild<GameSessionSavePopupComponent>('defaultSavePopup');
  protected customSavePopup = contentChild(GameSavePopupBase);
  protected activeSavePopup = computed(() => this.customSavePopup() ?? this.defaultSavePopup());

  public gameState = model.required<State | null>();
  public sessionService = input.required<GameSessionService<Config, State>>();
  public canSave = input<boolean>(true);
  public canPause = input<boolean>(true);
  public showFileUpload = input<boolean>(true);
  public scores = input<Record<string, number>>();

  protected isSaved = computed(() => {
    const state = this.gameState();
    return !state ? false : state.isSaved;
  })
  protected isPaused = computed(() => {
    const state = this.gameState();
    if (!state || !state.pauseEntries || state.pauseEntries.length === 0) return false;

    const last = state.pauseEntries[state.pauseEntries.length - 1];
    return last.resumeTime === null;
  });

  constructor() {
    // dynamically listen to the custom save popup output
    effect((onCleanup) => {
      const popup = this.customSavePopup();
      if (popup) {
        const sub = popup.saveSessionEvent.subscribe((event: WithFile<ResultStateBase>) => {
          this.saveSession(event);
        });
        onCleanup(() => sub.unsubscribe());
      }
    });
  }

  protected openSavePopup() {
    this.activeSavePopup()?.openPopup();
  }

  protected getSession() {
    this.sessionService().getSession().subscribe(res => {
      this.gameState.set(res);
    });
  }

  protected saveSession(event: WithFile<ResultStateBase>) {
    this.sessionService().saveSession(event.data, event.file).subscribe({
      next: res => {
        this.getSession();
      }
    });
  }

  protected pauseSession() {
    this.sessionService().pauseSession().subscribe(res => {
      this.gameState.set(res);
    });
  }

  protected resumeSession() {
    this.sessionService().resumeSession().subscribe(res => {
      this.gameState.set(res);
    });
  }
}