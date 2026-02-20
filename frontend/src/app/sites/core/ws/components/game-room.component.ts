import {Component, computed, effect, inject, input, model, OnDestroy, OnInit, signal, viewChild} from "@angular/core";
import {MainHeaderComponent} from "../../../../main/core/components/main-header/main-header.component";
import {GameRoomService} from "../game-room.service";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {GameRoomStateBase} from "../dto/GameRoomStateBase";
import {GameRoomLeavePopupComponent} from "./popups/leave-popup/leave-popup.component";
import {GameRoomInvitePopupComponent} from "./popups/invite-popup/invite-popup.component";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'game-room',
  imports: [
    MainHeaderComponent,
    FormsModule,
    ReactiveFormsModule,
    GameRoomLeavePopupComponent,
    GameRoomInvitePopupComponent,
    MatTooltip
  ],
  styles: [`
    .status-indicator {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        display: inline-block;
        background-color: #dc3545;
        box-shadow:
                inset 0 2px 4px rgba(255,255,255,0.25),
                inset 0 -2px 4px rgba(0,0,0,0.25);
    }
    
    .status-indicator.connected { 
        background-color: #198754;
    }
    
    .status-indicator.connecting { 
        background-color: #fd7e14;
    }
  `],
  template: `
      @let startScreen = roomService().gameState() === null;
      <app-main-header [showBack]="startScreen">
              <span [matTooltip]="'Connection status: ' + roomService().connectionStatus()" matTooltipPosition="right" ngProjectAs="middle" class="status-indicator me-auto"
                    [class.connected]="roomService().connectionStatus() === 'CONNECTED'"
                    [class.connecting]="roomService().connectionStatus() === 'CONNECTING' || roomService().connectionStatus() === 'UNKNOWN'">
                  
              </span>
          
          @if(!startScreen) {
          <button class="btn btn-primary" (click)="openInvitePopup()">
              <i class="bi bi-share"></i>
          </button>
          <button class="btn btn-danger" (click)="openLeavePopup()">
              <i class="bi bi-box-arrow-right"></i>
          </button>
          }
      </app-main-header>
      
      @if (roomService().gameState(); as state) {
          <div class="main-container">
              <div>Room Id: {{ state.room.roomId }}</div>
              @for (a of state.room.members; track a.username) {
                  <div>{{ a.username }}</div>
              }

              <div>Connection: {{ roomService().connectionStatus() }}</div>

              <ng-content></ng-content>
          </div>

          <game-room-invite-popup #invitePopup [inviteLink]="inviteLink()"/>
          <game-room-leave-popup #leavePopup
                                 (leaveRoomEvent)="leaveRoom()"/>
      } @else {
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

  private invitePopup = viewChild.required<GameRoomInvitePopupComponent>('invitePopup');
  private leavePopup = viewChild.required<GameRoomLeavePopupComponent>('leavePopup');

  public roomService = input.required<GameRoomService<GameRoomStateBase>>()
  public roomId = input<string>('');

  protected inviteLink = computed(() => {
    const state = this.roomService().gameState();
    if (!state) return '';

    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?roomId=${state.room.roomId}`;
  });

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

  protected openInvitePopup() {
    this.invitePopup().openPopup();
  }

  protected openLeavePopup() {
    this.leavePopup().openPopup();
  }
}