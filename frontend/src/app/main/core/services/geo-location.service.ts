import {inject, Injectable, signal} from '@angular/core';
import {NotificationService} from "./notification.service";

export interface GeoState {
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class GeoLocationService {
  private notificationService = inject(NotificationService);

  private state = signal<GeoState | null>(null);
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
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
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
