import { Component, signal } from '@angular/core';
import { PromptComponent } from './prompt.component';
interface chatMessage {   question: boolean, data: string }
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-chat',
  imports: [PromptComponent, NgIf],
  template: 
  `<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <h2 class="mb-4 text-2xl font-bold text-gray-800">
      Secure Chatting with {{ !filename()? 'PDFs': 'the pdf' + filename() }}
    </h2>
    @if(showSummary()){
      <div>
        <div class="bg-white rounded-lg shadow-md p-6 max-w-6xl w-full">
          <p class="text-lg text-gray-700 mb-2 border-b pb-2">
            Here is the summary of the file:
          </p>
          <p class="text-lg text-gray-700">
            {{ summary }}
          </p>
        </div>
      </div>
    }@else if(queryResponse.length != 0) {
      <div class="w-full">
        <div class="bg-white rounded-lg shadow-md p-6 w-full">
          <div *ngIf="queryResponse[0]?.question">
            <p class="text-lg text-gray-700 mb-2 border-b pb-2">
              Question: {{ queryResponse[0].data }}
            </p>
          </div>
          <div *ngIf="queryResponse[1]">
            <p class="text-lg text-gray-700">
              Answer: {{ queryResponse[1].data }}
            </p>
          </div>
        </div>
      </div>
    }
    <app-prompt 
      (msgFromChild)="receive($event)" 
      (title)="receiveFilename($event)" 
      (summary)="receiveSummary($event)"
      class="w-full"
    ></app-prompt>
  </div>`,
  styles: ``
})
export class ChatComponent {
  queryResponse: chatMessage[]= [];
  summary: string = "";
  showSummary = signal(false);
  filename = signal('')

    receive(data: chatMessage[]) {
      this.showSummary.set(false);  
      this.queryResponse = data;
      console.log('received', data);
    }

    receiveSummary(data:string){
      if(data){
        this.showSummary.set(true);
      }
    }

    receiveFilename(data: string){
      if(data){
        this.filename.set(`: ${data}`)
      }
    }

    toggleShowSummary(){
      this.showSummary.set(!this.showSummary());
    }
}
