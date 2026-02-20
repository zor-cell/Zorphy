import {Component, inject, input, OnDestroy} from '@angular/core';
import {NobodyIsPerfectService} from "../../nobody-is-perfect.service";
import {MainHeaderComponent} from "../../../../main/core/components/main-header/main-header.component";
import {FormBuilder, NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {config} from "rxjs";
import {GameRoomComponent} from "../../../core/ws/components/game-room.component";
import {state} from "@angular/animations";

@Component({
  selector: 'app-config',
  imports: [
    MainHeaderComponent,
    ReactiveFormsModule,
    GameRoomComponent
  ],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css'
})
export class NobodyIsPerfectConfigComponent {
  protected roomService = inject(NobodyIsPerfectService);

  public roomId = input<string>('');
}
