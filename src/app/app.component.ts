import { Component, Injectable, Input } from '@angular/core';
import {ApiService}  from "../app/api.service";
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, tap, switchMap} from 'rxjs/operators';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Injectable()
export class WikipediaService {
  constructor(private http: HttpClient) {}

  search(term: string) {


     return this.http
      .get('https://localhost:44324/api/Ciudad/'+term).pipe(

        map(response=> response)
      ); 
  }
  
}
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {

  readonly DELIMITER = '-';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        day : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        day : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }
}




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter},
    WikipediaService
  ],
  
})

export class AppComponent {
  title = 'Evaluacion';
  model1: any;
  searching = false;
  searchFailed = false;
  nombre='';
  email='';
  telefono='';
  ciudad='';
  Result = {
    nombre:'',
    email:'',
    telefono:'',
    fecha:'',
    ciudad:''
  };
  
  
  model: NgbDateStruct = {year:0, month:0, day:0};
  constructor(public apiService: ApiService,private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>,private _service: WikipediaService,private modalService: NgbModal){}
  open(content: any) {
    
    this.apiService.postuser(this.nombre,this.email,this.telefono,this.model,this.model1).subscribe(
      response => {
        if(response[0].validador){
          this.visibilidad('#fo',false)
          this.visibilidad('#msj',true)
        }else{
          console.log(response);
          this.Result.nombre = response[0].dnombre
          this.Result.email = response[0].demail
          this.Result.telefono = response[0].dtelefono
          this.Result.fecha = response[0].dfecha
          this.Result.ciudad = response[0].dciudad
          this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
        }
      }
    )
    
  }

   visibilidad(selector: any, visible: any) {
    var elemento = document.querySelector(selector);
    console.log(elemento);
    if (elemento != null) {
      elemento.style.display = visible?'block':'none';
    }
  }
  
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this._service.search(term).pipe(
          
          tap(() => this.searchFailed = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.searching = false)
    )
}


