import { Component, inject, signal } from '@angular/core';
import { PromptComponent } from './prompt.component';
interface chatMessage {   question: boolean, data: string }
import { CommonModule, NgIf } from '@angular/common';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  imports: [PromptComponent, NgIf],
  template: 
  `<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <h2 class="mb-4 text-2xl font-bold text-gray-800">
      Secure Chatting with the PDF 
    </h2>
    <div class="mb-4 text-lg text-gray-800"><i>  {{ filename }}  </i></div>
              @if(showSummary()){
                <div>
                  <div class="bg-white rounded-lg shadow-md p-6 max-w-6xl w-full">
                    <p class="text-lg text-gray-700 mb-2 border-b pb-2">
                      <b>Here is the summary of the file:</b>
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
                      <b>Question:</b> {{ queryResponse[0].data }}
                      </p>
                    </div>
                    <div *ngIf="queryResponse[1]">
                      <p class="text-lg text-gray-700">
                      <b>Answer:</b> {{ queryResponse[1].data }}
                      </p>
                    </div>
                  </div>
                </div>
              }
    <app-prompt 
      (msgFromChild)="receive($event)" 
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
  // filename = signal('')
    filename = inject(ChatService).filename;


    receive(data: chatMessage[]) {
      this.showSummary.set(false);  
      this.queryResponse = data;
      console.log('received', data);
    }

    receiveSummary(data:string){
      if(data){
        this.showSummary.set(true);
        this.summary = data
      }
    }


    toggleShowSummary(){
      this.showSummary.set(!this.showSummary());
    }
      
    




}
