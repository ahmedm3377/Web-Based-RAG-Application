import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';


import { SERVER_URL } from '../../../environments/environment.development';



@Injectable({
  providedIn: 'root'
})
export class ChatService {


 
   #http = inject(HttpClient);
 
   uploadFile(files: File) {
     return this.#http.post<{ success: boolean, data: { processedFiles: string, failedFiles: string } }>(SERVER_URL + 'docs/upload', files);
   }
   
   SendQuery(question:String) {
     return this.#http.post<{ success: boolean, data: string }>(SERVER_URL + 'docs/query', question);
   }

   giveSummary(file: string) {
    return this.#http.get<{ success: boolean, data: string  }>(SERVER_URL + 'docs/summarize?files=' + file);
  }
}
