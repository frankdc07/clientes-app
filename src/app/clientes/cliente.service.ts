import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
import { of, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

import { CLIENTES } from './clientes.json';
import { URL_BACKEND } from '../config/config';
import { Cliente } from './cliente';
import { Region } from './region';
import { AuthService } from '../usuarios/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = `${URL_BACKEND}/api/clientes`;//'http://localhost:8080/api/clientes';
  // Se comenta ya que se agrego la configuracion de interceptor HTTP
  //private httpHeaders: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient, private router: Router,
  private authService: AuthService) { }

  // Se comenta ya que se agrego la configuracion de interceptor HTTP
  // private agregarAuthorizationHeader() {
  //   let token = this.authService.token;
  //   if(token != null) {
  //     return this.httpHeaders.append('Authorization', 'Bearer ' + token);
  //   }
  //   return this.httpHeaders;
  // }

  getClientes(page: number): Observable<any> {
    //return of(CLIENTES);
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      map( (response: any) => {
        let clientes = response.content as Cliente[];
        clientes.map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          let datePipe = new DatePipe('es-CO');
          //cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd,  MMMM  Y');//formatDate(cliente.createAt, 'EEEE dd,  MMMM  Y', 'es-CO');
          return cliente;
        })
        return response;
      })
    );
  }

  getRegiones(): Observable<Region[]> {
    // Se comenta ya que se agrego la configuracion de interceptor HTTP
    //return this.http.get<Region[]>(`${this.urlEndPoint}/regiones`, {headers: this.agregarAuthorizationHeader()}).pipe(
    return this.http.get<Region[]>(`${this.urlEndPoint}/regiones`);
  }

  getCliente(id: number): Observable<Cliente> {
    // Se comenta ya que se agrego la configuracion de interceptor HTTP
    //return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.agregarAuthorizationHeader()}).pipe(
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if(e.status != 401){
          this.router.navigate(['/clientes']);
        }
        return throwError(e);
      })
    );
  }

  create(cliente: Cliente): Observable<Cliente> {
    // Se comenta ya que se agrego la configuracion de interceptor HTTP
    //return this.http.post(this.urlEndPoint, cliente, {headers: this.agregarAuthorizationHeader()}).pipe(
    return this.http.post(this.urlEndPoint, cliente).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        if(e.status == 400){
          return throwError(e);
        }
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<any> {
    // Se comenta ya que se agrego la configuracion de interceptor HTTP
    //return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.agregarAuthorizationHeader()}).pipe(
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente).pipe(
      catchError(e => {
        if(e.status == 400){
          return throwError(e);
        }
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Cliente> {
    // Se comenta ya que se agrego la configuracion de interceptor HTTP
    //return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.agregarAuthorizationHeader()}).pipe(
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);

    // Se comenta ya que se agrego la configuracion de interceptor HTTP
    // let httpHeaders = new HttpHeaders();
    // let token = this.authService.token;
    // if(token != null) {
    //   httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
    // }

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
      // Se comenta ya que se agrego la configuracion de interceptor HTTP
      //, headers: httpHeaders
    });

    return this.http.request(req);
  }

}
