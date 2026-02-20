import {Component, effect, inject, input, model, OnDestroy, OnInit, signal, viewChild} from "@angular/core";
import {MainHeaderComponent} from "../../../../main/core/components/main-header/main-header.component";
import {GameRoomService} from "../game-room.service";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {GameRoomStateBase} from "../dto/GameRoomStateBase";
import {GameRoomLeavePopupComponent} from "./popups/leave-popup/leave-popup.component";

@Component({
  selector: 'game-room',
  imports: [
    MainHeaderComponent,
    FormsModule,
    ReactiveFormsModule,
    GameRoomLeavePopupComponent
  ],
  template: `
      @if (roomService().gameState(); as state) {
          <app-main-header [showBack]="false">
              <button class="btn btn-danger" (click)="openLeavePopup()">
                  <i class="bi bi-box-arrow-right"></i>
              </button>
          </app-main-header>

          <div class="main-container">
              <div>Room Id: {{state.room.roomId}}</div>
              @for(a of state.room.members; track a.username) {
                  <div>{{a.username}}</div>
              }

              <div>Connection: {{ roomService().connectionStatus() }}</div>
              
              <ng-content></ng-content>
          </div>

          <game-room-leave-popup #leavePopup
                                 (leaveRoomEvent)="leaveRoom()"/>
      } @else {
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
                              <button class="btn btn-primary" [disabled]="configForm.controls.username.invalid"
                                      (click)="createRoom()">Create New Room
                              </button>

                              <div>
                                  <div class="text-center p-2">OR</div>

                                  <input class="m-2" placeholder="Room Id" formControlName="roomId">
                                  <button class="btn btn-secondary" [disabled]="configForm.invalid"
                                          (click)="joinRoom()">
                                      Join Room
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              </section>
          </div>
      }
  `
})
export class GameRoomComponent implements OnDestroy {
  private fb = inject(FormBuilder);

  private leavePopup = viewChild.required<GameRoomLeavePopupComponent>('leavePopup');

  public roomService = input.required<GameRoomService<GameRoomStateBase>>()
  public roomId = input<string>('');

  protected configForm = this.fb.group({
    username: this.fb.control<string>("", [Validators.required]),
    roomId: this.fb.control<string>("", [Validators.required])
  });

  constructor() {
    effect(() => {
      const roomId = this.roomId();
      if(roomId) {
        this.configForm.patchValue({roomId: roomId});
      }
    });
  }

  ngOnDestroy() {
    this.roomService().disconnect();
  }

  protected createRoom() {
    const value = this.configForm.getRawValue();
    if(value.username == null) return;

    this.roomService().createRoom(value.username);
  }

  protected joinRoom() {
    const value = this.configForm.getRawValue();
    if(value.username == null || value.roomId == null) return;

    this.roomService().joinRoom(value.username, value.roomId);
  }

  protected leaveRoom() {
    this.roomService().disconnect();
  }

  protected openLeavePopup() {
    this.leavePopup().openPopup();
  }
}