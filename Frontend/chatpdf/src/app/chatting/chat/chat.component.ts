import { Component } from '@angular/core';
import { PromptComponent } from '../prompt/prompt.component';
interface chatMessage {   question: boolean, data: string }
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  imports: [PromptComponent],
  template: `
   
   <div class="flex flex-col items-center justify-center  bg-gray-100 p-4">
      <h2 class="mb-4 text-2xl font-bold text-gray-800">Secure Chating with PDF</h2>
      
      <div class="bg-white rounded-lg shadow-md p-6 max-w-6xl w-full">
          @if(msg[0].question)
            {
              <p  class="text-lg text-gray-700 mb-2 border-b pb-2">
                Question: {{ msg[0].data }}
              </p>
            }
          @if(msg[1])
            {
              <p class="text-lg text-gray-700">
                Answer:{{ msg[1].data }}
              </p>
            }

      </div>

      <app-prompt (msgFromChild)="receive($event)"></app-prompt>
</div>


   
  `,
  styles: ``
})
export class ChatComponent {
  msg: chatMessage[]= [{ question: false, data: '' }];
  receive(data: chatMessage[]) {  
    this.msg = data;
    console.log('received', data);
    }
}
