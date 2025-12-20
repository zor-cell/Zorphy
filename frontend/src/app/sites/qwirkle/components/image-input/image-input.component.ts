import {Component} from '@angular/core';

import {QwirkleService} from "../../qwirkle.service";

@Component({
  selector: 'qwirkle-image-input',
  imports: [],
  templateUrl: './image-input.component.html',
  
  styleUrl: './image-input.component.css'
})
export class ImageInputComponent {
  originalFile: File | null = null;
  processedFileUrl: string | null = null;

  constructor(private qwirkleService: QwirkleService) {
  }

  onFileChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    if(!input.files?.length) return;

    if(input.files) {
      this.originalFile = input.files![0];
      this.qwirkleService.uploadImage(this.originalFile).subscribe(res => {
        this.createImageFromBlob(res);
      });
    }
  }

  private createImageFromBlob(blob: Blob) {
    if(this.processedFileUrl) {
      URL.revokeObjectURL(this.processedFileUrl);
    }

    this.processedFileUrl = URL.createObjectURL(blob);
  }
}
