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
import {NobodyIsPerfectService} from "../../../nobody-is-perfect/nobody-is-perfect.service";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {GameRoomStateBase} from "../dto/GameRoomStateBase";

@Component({
  selector: 'game-room-config',
  imports: [
    MainHeaderComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
      <app-main-header/>

      <div class="main-container">
          <section class="config-container" style="grid-template-columns: 1fr; justify-items: center;">
              <div class="config-grid-container">
                  <div class="config-header">
                      Room settings
                  </div>

                  <div class="flex-container gap-4" [formGroup]="configForm">
                      <input placeholder="Username" formControlName="username">

                      <div class="flex-container">
                          <button class="btn btn-primary" [disabled]="configForm.controls.username.invalid" (click)="create()">Create New Room</button>

                          <div>
                              <div class="text-center p-2">OR</div>

                              <input class="m-2" placeholder="Room Id" formControlName="roomId">
                              <button class="btn btn-secondary" [disabled]="configForm.invalid" (click)="join()">Join Room</button>
                          </div>
                      </div>
                  </div>
              </div>
          </section>
      </div>
    `
})
export class GameRoomConfigComponent {
  private fb = inject(FormBuilder);

  public roomService = input.required<GameRoomService<GameRoomStateBase>>()

  protected configForm = this.fb.group({
    username: this.fb.control<string>("", [Validators.required]),
    roomId: this.fb.control<string>("", [Validators.required])
  });

  protected create() {
    const value = this.configForm.getRawValue();
    if(value.username == null) return;

    this.roomService().createRoom(value.username);
  }

  protected join() {
    const value = this.configForm.getRawValue();
    if(value.username == null || value.roomId == null) return;

    this.roomService().joinRoom(value.username, value.roomId);
  }
}