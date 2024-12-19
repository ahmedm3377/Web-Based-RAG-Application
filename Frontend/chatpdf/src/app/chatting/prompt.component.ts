import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatService } from './chat.service';




interface chatMessage {   question: boolean, data: string }

@Component({
  selector: 'app-prompt',
  imports: [ReactiveFormsModule],
  styleUrls: [],
  template: `
    <div [class]="conversationReady() ? 'w-full' : 'w-1/2'" class="mx-auto my-5 p-5 border-2 border-blue-500 rounded-lg bg-gray-100 shadow-lg">
      <form [formGroup]="form">
        @if(!conversationReady()) {
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
          <br />
        } @else {
          <div class="w-full flex items-center space-x-4">
            <input 
              type="text" 
              placeholder="Search..." 
              formControlName="searchBox" 
              class="w-full h-10 p-2 border-2 border-gray-300 rounded-lg transition-colors duration-300 focus:border-blue-500 focus:outline-none"
            />
            <button 
              (click)="search()" 
              class="h-10 bg-blue-500 text-white border-none rounded-md py-2 px-4 cursor-pointer transition duration-300 hover:bg-green-600"
            >
              >>
            </button>
          </div>
          <div>
            @if(selectedFile) {
              <button 
                (click)="getSummary()" 
                class="bg-blue-500 text-white border-none rounded-md py-2 px-4 cursor-pointer transition duration-300 hover:bg-green-600"
              >
                Summary
              </button>
            }
          </div>
        }
      </form>
    </div>
  `,
  styles: `
  
  `
})
export class PromptComponent {
  chatService = inject(ChatService);
  
  msgFromChild = output<chatMessage[]>();
  summary = output<string>();

  // Pass the filename to the parent component and use it as a title
  title = output<string>();

  conversationReady = signal(false);
  isLoading = signal(false);


  form = inject(FormBuilder).nonNullable.group({
    searchBox:['', Validators.required]
      });

    search(){
      let textValue = this.form.controls.searchBox.value;
      if (textValue) {
          this.msgFromChild.emit([{ question: true, data: textValue }]);
          const filename = this.selectedFile ? this.selectedFile.name : ''
          this.chatService.SendQuery(textValue, filename).subscribe(response => {
            this.msgFromChild.emit( [{ question: true, data: textValue },{ question: false, data: response.data }] );
            this.form.controls.searchBox.setValue('');
          });
      }

    }

  selectedFile: File | null = null;
  

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  filename = "";
  uploadFile() {
    if (this.selectedFile) {
      this.isLoading.set(true);
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
      const result = this.chatService.uploadFile(formData);
      result.subscribe(response => {
      if (response.success) {
          alert("File uploaded successfully!");
          this.filename = response.data;
          this.conversationReady.set(true)
          this.title.emit(this.filename)
      }
      this.isLoading.set(false);
      });
      console.log('Uploading file:', this.selectedFile);
    }
  }


  getSummary(){

    this.chatService.giveSummary(this.filename).subscribe(res => {
      console.log(res);
      this.summary.emit(res.data);

    }); 

  }


}