import {AfterViewInit, Component, effect, ElementRef, inject, OnDestroy, OnInit, viewChild} from '@angular/core';
import {GameRoomComponent} from "../../../core/ws/components/game-room.component";
import {AirsoftService} from "../../airsoft.service";
import {GeoLocationService} from "../../../../main/core/services/geo-location.service";
import * as L from 'leaflet';
import {map} from "rxjs";
import {PlayerMapEntity} from "../../classes/PlayerMapEntity";
import {latLng} from "leaflet";

@Component({
  selector: 'airsoft-game',
  imports: [
    GameRoomComponent
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class AirsoftGameComponent implements OnInit, AfterViewInit, OnDestroy {
  protected geoService = inject(GeoLocationService);
  protected roomService = inject(AirsoftService);

  private mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('map');
  private map!: L.Map;
  private resizeObserver!: ResizeObserver;
  private playerMarkers = new Map<string, PlayerMapEntity>();

  constructor() {
    //send local location update every time the geo service changes
    effect(() => {
      const location = this.geoService.location();
      if (location) {
        this.roomService.updateLocation(location);
      }
    });

    //redraw all markers every time the locations change
    effect(() => {
      const locations = this.roomService.locations();

      if(!this.map) return;

      const activeUsernames = new Set<string>();

      for (const player of locations) {
        activeUsernames.add(player.username);

        const playerEntity = this.playerMarkers.get(player.username);
        if (playerEntity) {
          playerEntity.update(player.location);
        } else {
          const newEntity = new PlayerMapEntity(this.map, player);
          this.playerMarkers.set(player.username, newEntity);
        }
      }

      //remove markers for players who left the room
      for (const [username, entity] of this.playerMarkers.entries()) {
        if (!activeUsernames.has(username)) {
          entity.destroy();
          this.playerMarkers.delete(username);
        }
      }
    });
  }

  ngOnInit() {
    this.geoService.startTracking();
  }

  ngAfterViewInit() {
    this.initMap(this.mapContainer().nativeElement);
  }

  ngOnDestroy() {
    this.geoService.stopTracking();

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(container: HTMLDivElement): void {
    this.map = L.map(container, {
      center: [48.2082, 16.3738],
      zoom: 12
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 0,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    /*const tiles = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
      minZoom: 0,
      maxZoom: 20,
      attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });*/
    tiles.addTo(this.map);

    this.resizeObserver = new ResizeObserver(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    });
    this.resizeObserver.observe(container);
  }
}
