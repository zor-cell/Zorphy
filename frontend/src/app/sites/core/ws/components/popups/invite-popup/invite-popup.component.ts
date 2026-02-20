import {Component, inject, input, output, TemplateRef, viewChild} from '@angular/core';
import {PopupService} from "../../../../../../main/core/services/popup.service";
import {QRCodeComponent} from "angularx-qrcode";
import {PopupResultType} from "../../../../../../main/core/dto/PopupResultType";
import {NotificationService} from "../../../../../../main/core/services/notification.service";

@Component({
  selector: 'game-room-invite-popup',
  imports: [
    QRCodeComponent
  ],
  templateUrl: './invite-popup.component.html',
  styleUrl: './invite-popup.component.css',
})
export class GameRoomInvitePopupComponent {
  private popupService = inject(PopupService);
  private notificationService = inject(NotificationService);

  public inviteLink = input.required<string>();

  private inviteTemplate = viewChild.required<TemplateRef<any>>('invitePopup');
  public clearSessionEvent = output<void>();

  public openPopup() {
    this.popupService.createPopup(
      'Invite Friends',
      this.inviteTemplate(),
      this.callback.bind(this)
    );
  }

  protected copyInviteLink() {
    navigator.clipboard.writeText(this.inviteLink()).then(() => {
      this.notificationService.handleSuccess('Invite link copied to clipboard');
    });
  }

  private callback(result: PopupResultType) {
    if (result === PopupResultType.SUBMIT) {
      this.clearSessionEvent.emit();
    }
  }
}
