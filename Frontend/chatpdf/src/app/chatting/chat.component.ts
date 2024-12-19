import { Component, signal } from '@angular/core';
import { PromptComponent } from './prompt.component';
interface chatMessage {   question: boolean, data: string }
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  imports: [PromptComponent],
  template: 
  `

  <div class="flex flex-col items-center justify-center  bg-gray-100 p-4">
    <h2 class="mb-4 text-2xl font-bold text-gray-800">Secure Chating with PDF</h2>
      @if(showSummary())
        {
        
          <div class="bg-white rounded-lg shadow-md p-6 max-w-6xl w-full">

              <p  class="text-lg text-gray-700 mb-2 border-b pb-2">
                Here is the summery of the file:
              </p>
      
              <p class="text-lg text-gray-700">
                {{ summary }}
              </p>
          </div>

      } 
      @else{
        
          <div class="bg-white rounded-lg shadow-md p-6 max-w-6xl w-full">
              @if(queryResponse[0].question)
                {
                  <p  class="text-lg text-gray-700 mb-2 border-b pb-2">
                    Question: {{ queryResponse[0].data }}
                  </p>
                }
              @if(queryResponse[1])
                {
                  <p class="text-lg text-gray-700">
                    Answer:{{ queryResponse[1].data }}
                  </p>
                }
          </div>
        }

      
   </div>
<app-prompt (msgFromChild)="receive($event)" (summary)="receiveSummary($event)"></app-prompt>
   
  `,
  styles: ``
})
export class ChatComponent {
  queryResponse: chatMessage[]= [{ question: false, data: '' }];
  summary: string = "";
  showSummary = signal(false);

    receive(data: chatMessage[]) {
      this.showSummary.set(false);  
      this.queryResponse = data;
      console.log('received', data);
    }

    receiveSummary(data:string){
      if(data)
        {
        this.showSummary.set(true);
      }

    }

    toggleShowSummary(){
      this.showSummary.set(!this.showSummary());
    }
}
