import * as L from 'leaflet';

import {GeoLocation} from "../../../main/core/dto/GeoLocation";
import {PlayerGeoLocation} from "../dto/PlayerGeoLocation";

export class PlayerMapEntity {
  private marker: L.Marker;
  private accuracyCircle: L.Circle;

  constructor(
    private map: L.Map,
    public readonly playerLocation: PlayerGeoLocation
  ) {
    const location = playerLocation.location;
    const latLng: L.LatLngTuple = [location.latitude, location.longitude];

    this.accuracyCircle = L.circle(latLng, {
      radius: location.accuracy ?? 0,
      color: '#136AEC',
      fillColor: '#136AEC',
      fillOpacity: 0.15,
      weight: 1
    }).addTo(this.map);

    this.marker = L.marker(latLng, {
      icon: this.createIcon(location.heading)
    }).addTo(this.map);
  }

  public update(location: GeoLocation): void {
    const latLng: L.LatLngTuple = [location.latitude, location.longitude];

    // Move circle and update radius
    this.accuracyCircle.setLatLng(latLng);
    this.accuracyCircle.setRadius(location.accuracy ?? 0);

    // Move marker and update rotation
    this.marker.setLatLng(latLng);
    this.marker.setIcon(this.createIcon(location.heading));
  }

  /**
   * Cleans up all used resources
   */
  public destroy(): void {
    this.accuracyCircle.remove();
    this.marker.remove();
  }

  private createIcon(heading: number | null | undefined): L.DivIcon {
    const hasHeading = heading !== null && heading !== undefined;

    const iconWidth = 32;
    const iconHeight = 32;

    const rotation = hasHeading ? heading : 0;

    const imgSrc = '/assets/airsoft/player-arrow.svg'
    const html = `
      <img 
        src="${imgSrc}" 
        style="
          width: ${iconWidth}px; 
          height: ${iconHeight}px; 
          transform: rotate(${rotation}deg); 
          transform-origin: center center; 
          display: block;
        " 
      />
    `;

    return L.divIcon({
      html: html,
      className: '', // Prevents the default Leaflet white square background
      iconSize: [iconWidth, iconHeight],
      iconAnchor: [iconWidth / 2, iconHeight / 2]
    });
  }
}