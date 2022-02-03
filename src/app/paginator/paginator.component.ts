import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html'
})
export class PaginatorComponent implements OnInit, OnChanges {

  @Input() paginador: any;

  paginas: number[];
  desde: number;
  hasta: number;

  constructor() { }

  ngOnInit(): void {
    this.initPaginator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    let paginadorActualizado = changes['paginador'];
    if(paginadorActualizado.previousValue) {
      this.initPaginator();
    }
  }

  initPaginator(): void {
    this.desde = Math.min(Math.max(1, this.paginador.number), this.paginador.totalPages - 2);
    this.hasta = Math.max(Math.min(this.paginador.totalPages, this.paginador.number + 2), 3);

    if(this.paginador.totalPages > 3) {
      this.paginas = new Array(this.hasta - this.desde + 1).fill(0).map((_valor, indice) => indice + this.desde);
    } else {
      this.paginas = new Array(this.paginador.totalPages).fill(0).map((_valor, indice) => indice + 1);
    }
  }

}
