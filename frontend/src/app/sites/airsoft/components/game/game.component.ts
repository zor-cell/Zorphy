import {AfterViewInit, Component, effect, ElementRef, inject, OnDestroy, OnInit, viewChild} from '@angular/core';
import {GameRoomComponent} from "../../../core/ws/components/game-room.component";
import {AirsoftService} from "../../airsoft.service";
import {GeoLocationService} from "../../../../main/core/services/geo-location.service";
import * as L from 'leaflet';

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

  constructor() {
    effect(() => {
      const loc = this.geoService.location();

      if(loc) {
        this.roomService.updateLocation(loc);

        L.marker([loc.latitude, loc.longitude]).addTo(this.map);
        const circle = L.circle([loc.latitude, loc.longitude], {
          color: 'red',
          radius: loc.accuracy,
          fillOpacity: 0.2,
        }).addTo(this.map);
      }
    })
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
    if(this.map) {
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
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);

    this.resizeObserver = new ResizeObserver(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    });
    this.resizeObserver.observe(container);
  }
}
