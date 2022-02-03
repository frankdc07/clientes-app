import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public cliente: Cliente = new Cliente();
  public titulo: string = "Crear cliente";
  public regiones: Region[];

  errores: any;

  constructor(private clienteService: ClienteService,
  private router: Router,
  private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
  }

  public cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.clienteService.getCliente(id).subscribe( cliente => this.cliente = cliente);
      }
    });
    this.clienteService.getRegiones().subscribe( regiones => {
      this.regiones = regiones;
    });
  }

  public create(): void {
    this.clienteService.create(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes']);
        swal.fire('Nuevo cliente', `Cliente ${cliente.nombre} creado con éxito!`, 'success');
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Codigo de error del backend: ' + err.status);
        console.error(this.errores);
        console.log(err.error.errors);
      }
    );
  }

  public update(): void {
    this.cliente.facturas = null;
    this.clienteService.update(this.cliente).subscribe(
      response => {
        this.router.navigate(['/clientes']);
        swal.fire('Cliente actualizado', `Cliente ${response.cliente.nombre} actualizado con éxito!`, 'success')
      },
      err => {
        this.errores = err.error.errors as string[];
      }
    )
  }

  compararRegion(o1: Region, o2: Region): boolean {
    if(o1 == undefined && o2 == undefined) {
      return true;
    }

    return o1 == null || o2 == null? false: o1.id === o2.id;
  }

}
