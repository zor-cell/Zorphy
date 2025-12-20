import {Component, inject, OnInit, signal} from '@angular/core';
import {GameService} from "../../../services/game.service";
import { DatePipe } from "@angular/common";
import {DurationPipe} from "../../../pipes/DurationPipe";
import {GameMetadata} from "../../../dto/games/GameMetadata";
import {Router} from "@angular/router";
import {MainHeaderComponent} from '../../all/main-header/main-header.component';
import {GameSearchComponent} from "../game-search/game-search.component";
import {GameFilters} from "../../../dto/games/GameFilters";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'game-list',
  imports: [
    DatePipe,
    DurationPipe,
    MainHeaderComponent,
    GameSearchComponent
],
  templateUrl: './game-list.component.html',
  
  styleUrl: './game-list.component.css'
})
export class GameListComponent implements OnInit {
  private router = inject(Router);
  private gameService = inject(GameService);
  protected authService = inject(AuthService);

  protected dateFormat = 'MMM d, yyyy HH:mm';
  protected games = signal<GameMetadata[]>([]);
  protected isLoading = signal<boolean>(false);

  ngOnInit(): void {
    //adjust date format
    const mql = window.matchMedia('(max-width: 600px)');
    this.updateDateFormat(mql.matches);

    mql.addEventListener('change', (e) => {
      this.updateDateFormat(e.matches);
    });
  }

  protected openGameInfo(id: string) {
    this.router.navigate(['/games', id]);
  }

  protected openGameStats() {
    this.router.navigate(['/games/stats']);
  }

  protected searchFiltersChanged(filters: GameFilters) {
    this.searchGames(filters);
  }

  private searchGames(filters: GameFilters | null = null) {
    this.isLoading.set(true);
    this.gameService.searchGames(filters).subscribe({
      next: res => {
          this.isLoading.set(false);
          this.games.set(res);
        },
      error: err => {
        this.isLoading.set(false);
      }});
  }

  private updateDateFormat(isSmallScreen: boolean) {
    this.dateFormat = isSmallScreen ? 'dd.MM.yyyy' : 'MMM d, yyyy HH:mm';
  }
}
