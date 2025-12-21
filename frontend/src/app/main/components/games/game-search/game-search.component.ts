import {Component, inject, input, OnInit, output, signal} from '@angular/core';
import {NgbPopover} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {GameFilters} from "../../../dto/games/GameFilters";
import {Options} from "@popperjs/core";
import {GameType} from "../../../dto/games/GameType";
import {DurationPipe} from "../../../pipes/DurationPipe";

import {PlayerService} from "../../../services/player.service";
import {PlayerDetails} from "../../../dto/all/PlayerDetails";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'game-search',
  imports: [
    NgbPopover,
    ReactiveFormsModule
],
  templateUrl: './game-search.component.html',
  
  styleUrl: './game-search.component.css'
})
export class GameSearchComponent implements OnInit {
  private fb = inject(FormBuilder);
  private playerService = inject(PlayerService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public showMultiGameTypes = input<boolean>(true);
  public changeFiltersEvent = output<GameFilters>();

  protected players = signal<PlayerDetails[]>([]);
  protected isPopoverOpen = signal<boolean>(false);
  protected searchForm = this.fb.group({
    text: this.fb.control<string | null>(null),
    dateFrom: this.fb.control<Date | null>(null),
    dateTo: this.fb.control<Date | null>(null),
    minPlayers: this.fb.control<number | null>(null),
    maxPlayers: this.fb.control<number | null>(null),
    minDuration: this.fb.control<string | null>(null),
    maxDuration: this.fb.control<string | null>(null),
    gameTypes: this.fb.control<GameType[] | null>(null),
    players: this.fb.control<string[] | null>(null)
  });
  protected popperOptions = (options: Partial<Options>) => {
    options.placement = 'bottom-end';

    return options;
  };
  protected allGameTypes = Object.values(GameType);

  ngOnInit() {
    //add validation on stats search
    if(!this.showMultiGameTypes()) {
      this.searchForm.controls.gameTypes.addValidators(Validators.required);
      this.searchForm.controls.players.addValidators(Validators.required);
    }

    //get query params from route
    const params = this.route.snapshot.queryParams;
    const gameTypes = params['gameTypes'];
    const players = params['players'];
    const filters: any = {
      text: params['text'] ?? null,
      dateFrom: params['dateFrom'] ? params['dateFrom'] : null,
      dateTo: params['dateTo'] ? params['dateTo'] : null,
      minPlayers: params['minPlayers'] ? params['minPlayers'] : null,
      maxPlayers: params['maxPlayers'] ? params['maxPlayers'] : null,
      minDuration: params['minDuration'] ?? null,
      maxDuration: params['maxDuration'] ?? null,
      gameTypes: gameTypes ? (Array.isArray(gameTypes) ? gameTypes : [gameTypes]) : null,
      players: players ? (Array.isArray(players) ? players : [players]) : null,
    };

    this.searchForm.patchValue(filters, {emitEvent: false});
    this.submit();

    //reflect form changes in query params
    this.searchForm.valueChanges.subscribe(filters => {
      const queryParams = filters as GameFilters;

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams,
        queryParamsHandling: "merge",
        replaceUrl: true
      });
    });

    this.getPlayers();
  }

  protected popOverOpen() {
    this.isPopoverOpen.set(true);
  }

  protected popOverClose() {
    this.isPopoverOpen.set(false);
  }

  protected clear() {
    this.searchForm.reset({
      text: this.searchForm.controls.text.value
    });
  }

  protected submit(popover: NgbPopover | null = null) {
    const filters = this.searchForm.getRawValue() as GameFilters;

    if(this.searchForm.invalid) return;


    //apply ISO standards
    filters.dateFrom = filters.dateFrom ? new Date(filters.dateFrom).toISOString() : null;
    filters.dateTo = filters.dateTo ? new Date(filters.dateTo).toISOString() : null;
    filters.minDuration = filters.minDuration ? DurationPipe.toIsoFormat(filters.minDuration) : null;
    filters.maxDuration = filters.maxDuration ? DurationPipe.toIsoFormat(filters.maxDuration) : null;

    this.changeFiltersEvent.emit(filters);

    if(popover) {
      popover.close();
    }
  }

  private getPlayers() {
    this.playerService.getPlayers().subscribe(res => {
      this.players.set(res);
    })
  }
}
