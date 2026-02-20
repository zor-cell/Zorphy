import {
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  model,
  OnDestroy,
  OnInit,
  signal,
  viewChild
} from "@angular/core";
import {MainHeaderComponent} from "../../../../main/core/components/main-header/main-header.component";
import {GameRoomService} from "../game-room.service";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {GameRoomStateBase} from "../dto/GameRoomStateBase";
import {GameRoomLeavePopupComponent} from "./popups/leave-popup/leave-popup.component";
import {GameRoomInvitePopupComponent} from "./popups/invite-popup/invite-popup.component";
import {MatTooltip} from "@angular/material/tooltip";
import {CdkDrag, CdkDragDrop, CdkDragPreview, CdkDropList, moveItemInArray} from "@angular/cdk/drag-drop";
import {GameRoomMember} from "../dto/GameRoomMember";
import {Team} from "../../../../main/core/dto/Team";

@Component({
  selector: 'game-room',
  imports: [
    MainHeaderComponent,
    FormsModule,
    ReactiveFormsModule,
    GameRoomLeavePopupComponent,
    GameRoomInvitePopupComponent,
    MatTooltip,
    CdkDrag,
    CdkDropList,
    CdkDragPreview
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

    .list-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
    }

    .drag-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        gap: 0.1rem;
    }

    .drag-element {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;

        height: 1.75rem;
    }

    .drag-player {
        display: grid;
        grid-template-columns: 1fr 3fr;
        gap: 0.2rem;
        align-items: center;

        overflow: clip;

        border-radius: 10px;
        background: white;
        border: 1px solid #ccc;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);

        width: 140px;
        height: 1.75rem;
    }
    
    .drag-player.is-host {
        cursor: move;
    }

    .player-name {
        display: flex;
        align-items: center;
        
        gap: 0.25rem;
        
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        text-align: left;
    }
    
    .host-icon {
        color: #ffc107;
        font-size: 0.8rem;
        line-height: 0.8rem;
    }
    
    .custom-input-lg {
        width: 140px;
    }
  `],
  template: `
      @let startScreen = roomService().gameState() === null;
      <app-main-header [showBack]="startScreen">
              <span [matTooltip]="'Connection status: ' + roomService().connectionStatus()" matTooltipPosition="right"
                    ngProjectAs="middle" class="status-indicator me-auto"
                    [class.connected]="roomService().connectionStatus() === 'CONNECTED'"
                    [class.connecting]="roomService().connectionStatus() === 'CONNECTING' || roomService().connectionStatus() === 'UNKNOWN'">
                  
              </span>

          @if (!startScreen) {
              <button class="btn btn-primary" (click)="openInvitePopup()">
                  <i class="bi bi-share"></i>
              </button>
              <button class="btn btn-danger" (click)="openLeavePopup()">
                  <i class="bi bi-box-arrow-right"></i>
              </button>
          }
      </app-main-header>

      @if (roomService().gameState(); as state) {
          <div class="main-container flex-container gap-5">
              <div class="flex-container gap-3">
                  <h3 class="config-header">Room {{ state.room.roomId }}</h3>

                  <div class="flex-container gap-2">
                      <div class="list-container">
                          <div cdkDropList
                               [cdkDropListData]="members()"
                               (cdkDropListDropped)="reorderMembers($event)"
                               [cdkDropListDisabled]="!isHost()"
                               class="drag-container"
                          >
                              @for (member of members(); track member.username; let i = $index) {
                                  <div class="drag-element">
                                      <button cdkDrag
                                              class="drag-player"
                                              [class.is-host]="isHost()">
                                          <span class="player-number">{{ i + 1 }}. </span>
                                          <span class="player-name" 
                                                [class.fw-bold]="member.username === roomService().username()">
                                              {{ member.username }}
                                              @if (member.username === state.room.host.username) {
                                                  <i class="bi bi-star-fill host-icon"></i>
                                              }
                                          </span>
                                          <!-- dragging preview -->
                                          <div *cdkDragPreview class="drag-player">
                                              <span class="player-number">{{ i + 1 }}. </span>
                                              <span class="player-name">{{ member.username }}</span>
                                          </div>
                                      </button>
                                  </div>
                              }
                          </div>
                      </div>
                  </div>
              </div>

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
                          <input class="custom-input-lg" placeholder="Username" formControlName="username">

                          <div class="flex-container">
                              <button class="btn btn-primary" [disabled]="configForm.controls.username.invalid"
                                      (click)="createRoom()">Create Room
                              </button>

                              <div>
                                  <div class="text-center p-2">OR</div>

                                  <div class="flex-container flex-row gap-2">
                                    <input class="custom-input-lg" placeholder="Room Id" formControlName="roomId">
                                    <button class="btn btn-secondary" [disabled]="configForm.invalid"
                                            (click)="joinRoom()">
                                        Join Room
                                    </button>
                                  </div>
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
  protected isHost = computed(() => {
    const state = this.roomService().gameState();
    const username = this.roomService().username();
    if (!state || !username) return false;

    return state.room.host.username === username;
  })

  protected members = linkedSignal({
    source: () => this.roomService().gameState()?.room?.members || [],
    computation: (sourceMembers) => [...sourceMembers]
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
    this.configForm.reset();
  }

  protected openInvitePopup() {
    this.invitePopup().openPopup();
  }

  protected openLeavePopup() {
    this.leavePopup().openPopup();
  }

  protected reorderMembers(event: CdkDragDrop<GameRoomMember[]>) {
    if(event.previousIndex == event.currentIndex) {
      return;
    }

    const members = [...this.members()];
    moveItemInArray(members, event.previousIndex, event.currentIndex);

    this.members.set(members);
    this.roomService().reorderMembers(this.members());
  }
}