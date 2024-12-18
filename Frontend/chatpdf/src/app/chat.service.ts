import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { SERVER_URL } from '../../environments/environment.development';



@Injectable({
  providedIn: 'root'
})
export class ChatService {


 
   #http = inject(HttpClient);
 
   uploadFile(data: File) {
     return this.#http.post<{ success: boolean, data: string }>(SERVER_URL + 'TBD', data);
   }
   
   SendQuery(query:String) {
     return this.#http.post<{ success: boolean, data: string }>(SERVER_URL + 'TBD', query);
   }
}
