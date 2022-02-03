import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import swal from 'sweetalert2';

import { Factura } from './models/factura';
import { Producto } from './models/producto';
import { ItemFactura } from './models/item-factura';
import { ClienteService } from '../clientes/cliente.service';
import { FacturaService } from './services/factura.service';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'
})
export class FacturasComponent implements OnInit {

  titulo: string = 'Nueva factura';
  factura: Factura = new Factura();

  autocompleteControl = new FormControl();
  productosFiltrados: Observable<Producto[]>;

  constructor(private clienteService: ClienteService, private activatedRoute: ActivatedRoute,
    private facturaService: FacturaService, private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let clienteId = +params.get('clienteId');
      this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente);
    });

    this.productosFiltrados = this.autocompleteControl.valueChanges.pipe(
      map(value => typeof value === 'string' ? value : value.nombre),
      mergeMap(value => value ? this._filter(value) : [])
    );
  }

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();
    //return this.options.filter(option => option.toLowerCase().includes(filterValue));
    return this.facturaService.filtrarProductos(filterValue);
  }

  public mostrarNombre(producto?: Producto): string | undefined {
    return producto ? producto.nombre : undefined;
  }

  public seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
    let producto = event.option.value as Producto;
    if (this.existeItem(producto.id)) {
      this.incrementaCantidad(producto.id);
    } else {
      let nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      this.factura.items.push(nuevoItem);
    }
    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  public actualizarCantidad(idProducto: number, event: any): void {
    let cantidad: number = event.target.value as number;
    if (cantidad == 0) {
      return this.eliminarItemFactura(idProducto);
    }
    this.factura.items = this.factura.items.map(item => {
      if (idProducto === item.producto.id) {
        item.cantidad = cantidad;
      }
      return item;
    });
  }

  private existeItem(idProducto: number): boolean {
    let existe = false;
    this.factura.items.forEach((item: ItemFactura) => {
      if (idProducto === item.producto.id) {
        existe = true;
      }
    });
    return existe;
  }

  private incrementaCantidad(idProducto: number): void {
    this.factura.items.forEach((item: ItemFactura) => {
      if (idProducto === item.producto.id) {
        ++item.cantidad;
      }
    });
  }

  public eliminarItemFactura(idProducto: number): void {
    this.factura.items = this.factura.items.filter((item: ItemFactura) => item.producto.id != idProducto);
  }

  public create(facturaForm): void {
    if (this.factura.items.length == 0) {
      this.autocompleteControl.setErrors({ 'invalid': true })
    }
    if (facturaForm.form.valid && this.factura.items.length > 0) {
      this.facturaService.create(this.factura).subscribe(factura => {
        swal.fire(this.titulo, `La factura ${factura.descripcion} ha sido creada con éxito`, 'success');
        this.router.navigate(['/facturas', factura.id]);
      });
    }

  }

}
