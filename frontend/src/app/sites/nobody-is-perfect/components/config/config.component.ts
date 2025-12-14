import {Component, inject} from '@angular/core';
import {NobodyIsPerfectService} from "../../nobody-is-perfect.service";
import {RxStompService} from "../../../all/services/ws/rx-stomp.service";
import {MainHeaderComponent} from "../../../../main/components/all/main-header/main-header.component";
import {join} from "@angular/compiler-cli";

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
