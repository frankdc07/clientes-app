import { ItemFactura } from './item-factura';
import { Cliente } from '../../clientes/cliente';

export class Factura {
  id: number;
  descripcion: string;
  observacion: string;
  items: Array<ItemFactura> = [];
  cliente: Cliente;
  total: number;
  createAt: string;

  calcularTotal(): number {
    this.total = 0;
    this.items.forEach(item => {
      this.total += item.calcularImporte();
    });
    return this.total;
  }
}
