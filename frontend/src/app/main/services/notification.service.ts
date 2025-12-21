import {inject, Injectable} from '@angular/core';
import {HttpContext} from "@angular/common/http";
import {SILENT_ERROR_HANDLER} from "../classes/interceptors";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private snackBarService = inject(MatSnackBar);

  private readonly cancelText = 'Cancel';
  private readonly config: MatSnackBarConfig = {
    horizontalPosition: "right",
    verticalPosition: "top",
    duration: 3000
  };

  public get silentErrorContext(): HttpContext {
    return new HttpContext().set(SILENT_ERROR_HANDLER, true);
  }

  public handleError(error: any): void {
    const e = error instanceof Object ? error.error : error;
    const status: number = error.status;

    let message = e instanceof ProgressEvent ? error.message : e;
    if (status === 0) {
      // backend unreachable
      message = 'Cannot connect to the server. Please check your internet connection or try again later'
    } else if (error.error && typeof error.error === 'string') {
      // text error
      message = error.error;
    } else if(error.error && Array.isArray(error.error)) {
      //array error
      message = error.error;
    } else if (error.error && error.error.message) {
      // JSON error
      message = error.error.message;
    } else if(error.error && error.error.detail) {
      message = error.error.detail;
    } else if (error.message) {
      message = error.message;
    }

    this.snackBarService.open(`ERROR ${status} ${message}`, this.cancelText, this.config);
  }

  public handleSuccess(message: string) {
    this.snackBarService.open(message, this.cancelText, this.config);
  }

  public handleLoading(message: string) {
    const config: MatSnackBarConfig = {
      ...this.config,
      duration: undefined
    };

    return this.snackBarService.open(message, undefined, config);
  }
}
