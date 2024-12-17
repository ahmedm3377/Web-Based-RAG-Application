import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatService } from '../../chat.service';

@Component({
  selector: 'app-prompt',
  imports: [ReactiveFormsModule],
  styleUrls: ['../chatingStyle.css'],
  template: `

<form [formGroup]="form">

<fieldset>
    <legend>Upload a text file to chat with:</legend>
<div style="width: 100%;">
    <input 
        id="file_input" 
        type="file" 
        (change)="onFileSelected($event)" 
        accept=".pdf, .txt, .doc, .docx" 
        class="file-input"
    >
    <button (click)="uploadFile()" class="upload-button">Upload</button>
    </div>
</fieldset>

<br />

<div class="relative inline-block" style="width: 100%;">
    <input 
        type="text" 
        placeholder="Search..." 
        formControlName="searchBox" 
        (keyup.enter)="search()"  
        class="search-input"
    />
    <button 
        (click)="search()" 
        class="absolute search-button"
    >
        >>
    </button>
</div>
</form>
  `,
  styles: `
  
  `
})
export class PromptComponent {
  chatService = inject(ChatService);


  form = inject(FormBuilder).nonNullable.group({
    searchBox:['', Validators.required]
      });

    search(){
      let textValue = this.form.controls.searchBox.value;
      if (textValue) {
          this.chatService.SendQuery(textValue);
          console.log(textValue);
          this.form.controls.searchBox.setValue('');
      }

    }

  selectedFile: File | null = null;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  uploadFile() {
    if (this.selectedFile) {
      this.chatService.uploadFile(this.selectedFile);
      console.log('Uploading file:', this.selectedFile);

    }
  }


}