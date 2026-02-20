import {Component, inject, output, TemplateRef, viewChild} from '@angular/core';
import {PopupService} from "../../../../../../main/core/services/popup.service";
import {PopupResultType} from "../../../../../../main/core/dto/PopupResultType";

@Component({
  selector: 'game-room-leave-popup',
  imports: [],
  templateUrl: './leave-popup.component.html',
  styleUrl: './leave-popup.component.css',
})
export class GameRoomLeavePopupComponent {
  private popupService = inject(PopupService);

  private leaveTemplate = viewChild.required<TemplateRef<any>>('leavePopup');
  public leaveRoomEvent = output<void>();

  public openPopup() {
    this.popupService.createPopup(
      'Leave Room',
      this.leaveTemplate(),
      this.callback.bind(this),
      undefined,
      'Leave'
    );
  }

  private callback(result: PopupResultType) {
    if (result === PopupResultType.SUBMIT) {
      this.leaveRoomEvent.emit();
    }
  }
}
