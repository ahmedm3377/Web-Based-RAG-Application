import { Component, inject, output, signal } from '@angular/core';
import { ChatService } from './chat.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
 
@Component({
  selector: 'app-upload',
  imports: [ReactiveFormsModule],
  template: `
  <div class="w-1/2 mx-auto my-5 p-5 border-2 border-blue-500 rounded-lg bg-gray-100 shadow-lg">
    <div class="w-full center">
      <legend class="text-2xl text-blue-500 mb-2">Upload a text file to chat with:</legend>
      <div class="relative max-w-6xl">
        <input
          id="file_input"
          type="file"
          (change)="onFileSelected($event)"
          accept=".pdf, .txt, .doc, .docx"
          class="inline-block my-2"
        />
        <button
          (click)="uploadFile()"
          [disabled]="isLoading()"
          class="absolute right-0 top-0 h-full bg-blue-500 text-white rounded-r-lg px-4 cursor-pointer transition duration-300 hover:bg-green-600"
        >
          {{ isLoading() ? 'Uploading...' : 'Upload' }}
        </button>
      </div>
    </div>
  `,
  styles: ``
})
 
export class UploadComponent {
  chatService = inject(ChatService);
  isLoading = signal(false);
  selectedFile: File | null = null;
  router = inject(Router)
  
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
 
  uploadFile() {
    if (this.selectedFile) {
      this.isLoading.set(true);
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
      const result = this.chatService.uploadFile(formData);
      result.subscribe(response => {
      if (response.success) {
          alert("File uploaded successfully!");
          this.chatService.setFilename(response.data);
          this.router.navigate(['', 'chat'])
      }
      this.isLoading.set(false);
      });
      console.log('Uploading file:', this.selectedFile);
    }
  }
 
}