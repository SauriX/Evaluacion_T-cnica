import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { 
    this.http.get('https://api.chucknorris.io/jokes/random')
  }
 public getprueba(){
    return this.http.get('https://localhost:44324/api/Ciudad', {responseType: 'json'});          
         
  }

  public postuser(nombre: any, email: any, telefono: any, fecha: any, estado: any){
    const formData = new FormData();
    formData.append("nombre",nombre);
    formData.append("email",email);
    formData.append("telefono",telefono);
    if(! (fecha.year == 0)){
      formData.append("fecha",fecha);
    }else{
      formData.append("fecha","");
    }
    if(estado=="undefined"){
      formData.append("estado","");
    }else{
    formData.append("estado",estado);
    } 
    return this.http.post('https://localhost:44324/api/Usuario', formData);
  }
}
