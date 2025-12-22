import {Component, inject} from '@angular/core';
import {NobodyIsPerfectService} from "../../nobody-is-perfect.service";
import {MainHeaderComponent} from "../../../../main/core/components/main-header/main-header.component";

@Component({
  selector: 'app-config',
  imports: [
    MainHeaderComponent
  ],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css'
})
export class NobodyIsPerfectConfigComponent {
  private stompService = inject(NobodyIsPerfectService);

  create() {
    this.stompService.createRoom();
  }

  join() {
    this.stompService.joinRoom("123");
  }

  test() {
    this.stompService.save();
  }
}
