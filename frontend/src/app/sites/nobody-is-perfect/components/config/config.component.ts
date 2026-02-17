import {Component, inject, OnDestroy} from '@angular/core';
import {NobodyIsPerfectService} from "../../nobody-is-perfect.service";
import {MainHeaderComponent} from "../../../../main/core/components/main-header/main-header.component";
import {FormBuilder, NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {config} from "rxjs";
import {GameRoomConfigComponent} from "../../../core/ws/components/game-room-config.component";

@Component({
  selector: 'app-config',
  imports: [
    MainHeaderComponent,
    ReactiveFormsModule,
    GameRoomConfigComponent
  ],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css'
})
export class NobodyIsPerfectConfigComponent implements OnDestroy {
  protected roomService = inject(NobodyIsPerfectService);
  private fb = inject(FormBuilder);

  protected configForm = this.fb.group({
    username: this.fb.control<string>("", [Validators.required]),
    roomId: this.fb.control<string>("", [Validators.required])
  });

  ngOnDestroy() {
    this.roomService.disconnect();
  }

  protected create() {
    const value = this.configForm.getRawValue();
    if(value.username == null) return;

    this.roomService.createRoom(value.username);
  }

  protected  join() {
    const value = this.configForm.getRawValue();
    if(value.username == null || value.roomId == null) return;

    this.roomService.joinRoom(value.username, value.roomId);
  }
}
