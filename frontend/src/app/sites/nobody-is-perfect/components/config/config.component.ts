import {Component, inject} from '@angular/core';
import {NobodyIsPerfectService} from "../../nobody-is-perfect.service";
import {RxStompService} from "../../../../rx-stomp.service";

@Component({
  selector: 'app-config',
  imports: [],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css'
})
export class NobodyIsPerfectConfigComponent {
  private stompService = inject(RxStompService);

  ngOnInit() {
    this.stompService.watch('/user/queue/created').subscribe(message => {
      console.log(message);
    });

    this.stompService.watch('/user/queue/joined').subscribe(message => {
      console.log(message);
    });

    this.stompService.watch('/user/queue/errors').subscribe(message => {
      console.log(message);
    });
  }
}
