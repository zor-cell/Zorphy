import {Component, output} from '@angular/core';
import {FileUpload} from "../../dto/FileUpload";

@Component({
  selector: 'app-file-upload',
  imports: [],
  templateUrl: './file-upload.component.html',
  
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent {
  public fileChangedEvent = output<FileUpload>();

  private fileUpload = new FileUpload();

  protected onFileChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    if(!input.files?.length) return;

    if(input.files) {
      this.fileUpload.setFile(input.files[0]);

      this.fileChangedEvent.emit(this.fileUpload);
    }
  }
}
