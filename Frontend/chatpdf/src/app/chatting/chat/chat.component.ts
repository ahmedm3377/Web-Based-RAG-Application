import { Component } from '@angular/core';
import { PromptComponent } from '../prompt/prompt.component';

@Component({
  selector: 'app-chat',
  imports: [PromptComponent],
  template: `

    <app-prompt></app-prompt>
  `,
  styles: ``
})
export class ChatComponent {

}
