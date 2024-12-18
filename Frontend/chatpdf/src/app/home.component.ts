import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <div>
    <div class=" bg-white shadow-lg rounded-lg max-w-6xl mx-auto p-6 align-middle">
        <h1 class="text-3xl font-bold text-center text-blue-600">Welcome to the Secure Document Chatting Application!</h1>
        <p class="mt-4 text-gray-700 text-center">
            This innovative platform combines the power of advanced AI with real-time data retrieval, enabling users to access accurate information and generate insightful content seamlessly based on your documents.
        </p>
        <p class="mt-2 text-gray-700 text-center">
            Whether you're a researcher, a content creator, or just curious, this Application is designed to enhance your experience by providing tailored responses and comprehensive solutions.
        </p>
        <p class="mt-6 text-center">
            <button [routerLink]="['signin']" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">Dive In</button>
        </p>
    </div>
    </div>

  `,
  styles: ``
})
export class HomeComponent {

}
