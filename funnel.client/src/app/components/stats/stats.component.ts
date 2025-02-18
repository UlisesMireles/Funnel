import { Component, OnInit, ViewChild } from '@angular/core';

/*PrimeNG*/
import { Table } from 'primeng/table';
import {LazyLoadEvent} from 'primeng/api';

// Interfaces
import { Stats } from '../../interfaces/stats';
@Component({
  selector: 'app-stats',
  standalone: false,

  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent {
  constructor() {
  }
  @ViewChild('dt') dt!: Table; // Referencia a la tabla

  EstatusDropdown = [
    { label: 'Todo', value: null },
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  stats: Stats[] = [];

  selectedEstatus: any = null;
  loading: boolean = true;
  modalVisible: boolean = false;
  insertar: boolean = false;
  first: number = 0;
  rows: number = 10;
  searchValue: string = '';

  FiltrarPorEstatus() {
    if (this.selectedEstatus == null) {
      this.dt.filter('', 'activo', 'equals');
      this.dt.filterGlobal('', 'contains');
    } else {
      this.dt.filter(this.selectedEstatus, 'activo', 'equals');
    }
  }
  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }
    pageChange(event: LazyLoadEvent) {
      if (event.first !== undefined) {
        this.first = event.first;
      }
      if (event.rows !== undefined) {
        this.rows = event.rows;
      }
    }
  getVisibleTotal(campo: string, dt: any): number {
    const registrosVisibles = dt.filteredValue ? dt.filteredValue : this.stats;
    if (campo === 'nombreEmpresa') {
      return registrosVisibles.length; // Retorna el número de registros visibles
    }
    return registrosVisibles.reduce((acc: number, empresa: Stats) => acc + Number(empresa[campo as keyof Stats] || 0), 0);
  }
}
