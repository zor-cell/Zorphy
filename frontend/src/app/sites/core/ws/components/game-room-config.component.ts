import {Component, inject, input, model, OnInit, signal, viewChild} from "@angular/core";
import {MainHeaderComponent} from "../../../../main/core/components/main-header/main-header.component";
import {GameSessionService} from "../../http/game-session.service";
import {Router} from "@angular/router";
import {GameSessionClearPopupComponent} from "../../http/components/popups/clear-popup/clear-popup.component";
import {GameSessionUpdatePopupComponent} from "../../http/components/popups/update-popup/update-popup.component";
import {GameConfigBase} from "../../http/dto/GameConfigBase";
import {GameStateBase} from "../../http/dto/GameStateBase";
import {GameRoomService} from "../game-room.service";
import {GameRoom} from "../../../nobody-is-perfect/dto/GameRoom";
import {GameRoomState} from "../../../nobody-is-perfect/dto/GameRoomState";

@Component({
  selector: 'game-room-config',
  imports: [
    MainHeaderComponent,
    GameSessionClearPopupComponent,
    GameSessionUpdatePopupComponent
  ],
  template: `
        <app-main-header>
        </app-main-header>

        <ng-content></ng-content>
    `
})
export class GameRoomConfigComponent implements OnInit {
  public roomService = input.required<GameRoomService<GameRoomState>>();

  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

  //to check for changes on update
  private originalConfig: GameConfigBase | null = null;

  private router = inject(Router);
}