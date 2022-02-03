import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';

import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from '../detalle/modal.service';
import { AuthService } from '../../usuarios/auth.service';
import { Factura } from '../../facturas/models/factura';
import { FacturaService } from '../../facturas/services/factura.service';
import { URL_BACKEND } from '../../config/config';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente: Cliente;
  titulo: string = "Detalle del cliente";
  fotoSeleccionada: File;
  progreso: number = 0;
  urlBackend: string = URL_BACKEND;

  constructor(private _modalService: ModalService, private clienteService: ClienteService,
  private _authService: AuthService, private facturaService: FacturaService) { }

  public get authService(): AuthService {
    return this._authService;
  }

  ngOnInit(): void { }

  seleccionarFoto(event) {
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    if(this.fotoSeleccionada.type.indexOf('image') < 0){
      swal.fire('Error', 'El archivo debe ser de tipo imagen', 'error');
      this.fotoSeleccionada = null;
    }
  }

  subirFoto() {
    if (!this.fotoSeleccionada) {
      swal.fire('Error!', 'Por favor seleccone una foto!', 'error');
    } else {
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).subscribe(event => {
        if(event.type === HttpEventType.UploadProgress){
          this.progreso = Math.round(100 * event.loaded / event.total);
        } else if(event.type === HttpEventType.Response){
          let response: any = event.body;
          this.cliente = response.cliente as Cliente;
          this.modalService.notificarUpload.emit(this.cliente);
          swal.fire('La foto se ha subido!', response.mensaje, 'success');
        }
      });
    }
  }

  cerrarModal() {
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

  get modalService(): ModalService {
    return this._modalService;
  }

  delete(factura: Factura): void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Estas seguro?',
      text: `Seguro que deseas borrar la factura?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, bórrala!',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
        this.facturaService.delete(factura.id).subscribe(response => {
          this.cliente.facturas = this.cliente.facturas.filter(fact => fact != factura);
          swal.fire('Factura eliminada!', `La factura ${factura.descripcion} ha sido eliminada exitosamente`, 'success');
        });
      }
    })
  }
}
