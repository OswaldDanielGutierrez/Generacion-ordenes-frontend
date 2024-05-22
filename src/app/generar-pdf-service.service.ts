import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenerarPdfServiceService {

  private urlBase = "http://localhost:8080/api/v1/mekatico/generarPdf";

  constructor(private clienteHttp: HttpClient) { }

  generarPdf(): Observable<Object>{
    return this.clienteHttp.get(this.urlBase, {responseType: 'blob'});
  }
}
