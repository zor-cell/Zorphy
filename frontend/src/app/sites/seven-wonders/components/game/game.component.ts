import {Component, inject, OnInit, signal} from '@angular/core';
import {SevenWondersService} from "../../seven-wonders.service";
import {GameState} from "../../dto/game/GameState";
import {Router} from "@angular/router";
import {GameSessionGameComponent} from "../../../core/http/components/game-session-game.component";
import {DuelSavePopupComponent} from "../popups/duel-save-popup/duel-save-popup.component";

@Component({
  selector: 'seven-wonders-game',
  imports: [
    GameSessionGameComponent,
    DuelSavePopupComponent
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class SevenWondersGameComponent implements OnInit {
  protected sevenWondersService = inject(SevenWondersService);
  private router = inject(Router);

  protected gameState = signal<GameState | null>(null);

  ngOnInit() {
    this.getSession();
  }

  private getSession() {
    this.sevenWondersService.getSession().subscribe({
      next: res => {
        this.gameState.set(res);
      },
      error: err => {
        this.router.navigate(['projects/seven-wonders']);
      }
    });
  }
}
