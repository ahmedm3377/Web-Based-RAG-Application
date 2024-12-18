import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatService } from './chat.service';
interface chatMessage {   question: boolean, data: string }


@Component({
  selector: 'app-prompt',
  imports: [ReactiveFormsModule],
  styleUrls: [],
  template: `
<div class="w-full mx-auto my-5 p-5 border-2 border-blue-500 rounded-lg bg-gray-100 shadow-lg">
<form [formGroup]="form" >


    <legend class="text-2xl text-blue-500 mb-2">Upload a text file to chat with:</legend>
<div class="relative max-w-6xl">
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

<div>
    <input 
        type="text" 
        placeholder="Search..." 
        formControlName="searchBox" 
        (keyup.enter)="search()"  
        class="pr-16 p-2 border-2 border-gray-300 rounded-lg transition-colors duration-300 focus:border-blue-500 focus:outline-none" 

    />
    <button 
        (click)="search()" 
        class="bg-blue-500 text-white border-none rounded-md py-2 px-4 cursor-pointer transition duration-300 hover:bg-green-600"

    >
        >>
    </button>
</div>
<div>
  @if(selectedFile){
    <p> File: {{selectedFile.name}}  <button (click)="getSummary()">Summary</button></p>
  }

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
          
          this.msgFromChild.emit([{ question: true, data: textValue },{ question: false, data: "123" }]);


          console.log(textValue);
          this.form.controls.searchBox.setValue('');
      }

    }

  selectedFile: File | null = null;
  

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  filename = "";
  uploadFile() {
    if (this.selectedFile) {
      const result = this.chatService.uploadFile(this.selectedFile);
      result.subscribe(response => {
        if (response.success) {
            alert("File uploaded successfully!"); 
            this.filename = response.data.processedFiles;
        }
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