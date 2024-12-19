import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatService } from './chat.service';
interface chatMessage {   question: boolean, data: string }


@Component({
  selector: 'app-prompt',
  imports: [ReactiveFormsModule],
  styleUrls: [],
  template: `

<div class="w-full max-w-6xl mx-auto my-5 p-5 border-2 border-blue-500 rounded-lg bg-gray-100 shadow-lg">
<form [formGroup]="form" >


  @if(fileUploaded){
        <div class="relative w-full max-w-6xl">
        <br/><p> File: {{selectedFile!.name}}   
        <button (click)="getSummary()"
        class="absolute right-20 bg-blue-500 text-white rounded-r-lg px-4 cursor-pointer transition duration-300 hover:bg-green-600"
        >Summary</button>
        <button (click)="toggleFileUploaded()"
        class="absolute right-0  bg-blue-500 text-white rounded-r-lg px-4 cursor-pointer transition duration-300 hover:bg-green-600"
        >+</button>

      </p><br />
        
        </div>
  }
  @else{


        <p class="text-xl text-blue-500 mb-2">Upload a text file to chat with:</p><br />
        <div class="relative w-full max-w-6xl">
            <input 
                id="file_input" 
                type="file" 
                (change)="onFileSelected($event)" 
                accept=".pdf, .txt, .doc, .docx" 
              class="inline-block my-2"
            >
            <button (click)="uploadFile()" class="absolute right-0 top-0 h-full bg-blue-500 text-white rounded-r-lg px-4 cursor-pointer transition duration-300 hover:bg-green-600">Upload</button>
        </div>


        <br />
  }

<div class="relative w-full max-w-6xl">
    <input 
        type="text" 
        placeholder="Search..." 
        formControlName="searchBox" 
        (keyup.enter)="search()"  
        class="inline-block w-full my-2 pr-16 p-2 border-2 border-gray-300 rounded-lg transition-colors duration-300 focus:border-blue-500 focus:outline-none" 

    />
    <button 
        (click)="search()" 
        class="absolute right-0 top-0 h-full bg-blue-500 text-white rounded-r-lg px-4 cursor-pointer transition duration-300 hover:bg-green-600"

    >
        >>
    </button>
</div>

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


  form = inject(FormBuilder).nonNullable.group({
    searchBox:['', Validators.required]
      });

    search(){
      let textValue = this.form.controls.searchBox.value;
      if (textValue) {
          this.msgFromChild.emit([{ question: true, data: textValue }]);
          let result = ""
          this.chatService.SendQuery(textValue).subscribe(response => {result = response.data;});
          
          this.msgFromChild.emit([{ question: true, data: textValue },{ question: false, data: result }]);


          console.log(textValue);
          this.form.controls.searchBox.setValue('');
      }

    }

  selectedFile: File | null = null;
  fileUploaded = false;
  

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  filename = "";
  uploadFile() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('files', this.selectedFile, this.selectedFile.name);
      const result = this.chatService.uploadFile(formData);
      result.subscribe(response => {
        console.log(response);
        if (response.success) {
            alert("File uploaded successfully!"); 
            this.filename = response.data.processedFiles;
            this.fileUploaded = true;
        }
        else {
          alert("File upload failed: ");
        }
    },
      error => {
        console.error('Error occurred:', error);
        alert("File upload failed");
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

  toggleFileUploaded(){
    this.fileUploaded = false;
  } 


}