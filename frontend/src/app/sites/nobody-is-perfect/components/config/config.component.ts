import {Component, inject, OnDestroy} from '@angular/core';
import {NobodyIsPerfectService} from "../../nobody-is-perfect.service";
import {MainHeaderComponent} from "../../../../main/core/components/main-header/main-header.component";
import {FormBuilder, NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {config} from "rxjs";

@Component({
  selector: 'app-config',
  imports: [
    MainHeaderComponent,
    ReactiveFormsModule
  ],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css'
})
export class NobodyIsPerfectConfigComponent implements OnDestroy {
  protected stompService = inject(NobodyIsPerfectService);
  private fb = inject(FormBuilder);

  protected configForm = this.fb.group({
    username: this.fb.control<string>("", [Validators.required])
  });

  ngOnDestroy() {
    this.stompService.disconnect();
  }

  create() {
    const value = this.configForm.getRawValue();
    if(value.username == null) return;

    this.stompService.createRoom(value.username);
  }

  join() {
    this.stompService.joinRoom("123");
  }

  test() {
    this.stompService.save();
  }

  protected readonly config = config;
}
