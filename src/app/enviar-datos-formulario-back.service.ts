import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatosFormulario } from './formulario/datosFormulario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnviarDatosFormularioBackService {

  private urlBase = "http://localhost:8080/api/v1/mekatico/guardarOrden";

  constructor(private clienteHttp: HttpClient) { }

  enviarFormulario(datosFormulario: DatosFormulario): Observable<Object>{
    return this.clienteHttp.post(this.urlBase, datosFormulario);
  }

}
