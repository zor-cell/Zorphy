import {inject, Injectable, signal} from '@angular/core';
import {NotificationService} from "./notification.service";
import {GeoLocation} from "../dto/GeoLocation";

@Injectable({
  providedIn: 'root',
})
export class GeoLocationService {
  private notificationService = inject(NotificationService);

  private state = signal<GeoLocation | null>(null);
  public readonly location = this.state.asReadonly();

  private watchId: number | null = null;

  startTracking(): void {
    if (!('geolocation' in navigator)) {
      this.state.set(null);
      this.notificationService.handleError('Geolocation is not supported');
      return;
    }

    this.stopTracking();

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.state.set({
          timestamp: position.timestamp,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          heading: position.coords.heading
        });
      },
      (error) => {
        this.notificationService.handleError(this.getErrorMessage(error));
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000
      }
    );
  }

  stopTracking(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  private getErrorMessage(error: GeolocationPositionError): string {
    switch (error.code) {
      case error.PERMISSION_DENIED: return 'User denied the request for Geolocation.';
      case error.POSITION_UNAVAILABLE: return 'Location information is unavailable.';
      case error.TIMEOUT: return 'The request to get user location timed out.';
      default: return 'An unknown error occurred.';
    }
  }
}
