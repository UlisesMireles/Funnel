import { Component, OnInit, ViewChild } from '@angular/core';

/*PrimeNG*/
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';

/*Services*/
import { StatsService } from '../../services/stats.service';
// Interfaces
import { Stats } from '../../interfaces/stats';
@Component({
  selector: 'app-stats',
  standalone: false,

  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent {

  ngOnInit(): void {
    this.getStats();
  }
  constructor(private statsService: StatsService,
      private messageService: MessageService) {
  }
  @ViewChild('dt') dt!: Table; // Referencia a la tabla

  EstatusDropdown = [
    { label: 'Todo', value: null },
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  stats: Stats[] = [];
  statsOriginal: Stats[] = [];

  filterStatus = '';
  selectedEstatus: any = null;
  loading: boolean = true;
  modalVisible: boolean = false;
  insertar: boolean = false;
  first: number = 0;
  rows: number = 10;
  searchValue: string = '';
  getStats() {
    this.statsService.getStats().subscribe({
      next: (result: Stats[]) => {
        this.stats = result;
        this.statsOriginal=result;
        this.selectedEstatus = true;
        this.FiltrarPorEstatus();
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Se ha producido un error.',
          detail: error.errorMessage,
        });
        this.loading = false;
      },
    });
  }
  FiltrarPorEstatus() {
    this.stats = this.selectedEstatus === null
      ? [...this.statsOriginal]
      : [...this.statsOriginal.filter(stat =>
        stat.estatus === (this.selectedEstatus ? true : false)
      )];
    if (this.dt) {
      this.dt.first = 0;
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
    this.filterStatus='';
    this.dt.reset();
    this.getStats();
  }
    pageChange(event: LazyLoadEvent) {
      if (event.first !== undefined) {
        this.first = event.first;
      }
      if (event.rows !== undefined) {
        this.rows = event.rows;
      }
    }
    updateFilter(event: any, field: string) {
      this.dt.filter(event, field, 'contains');
    }
  getVisibleTotal(campo: string, dt: any): number {
    const registrosVisibles = dt.filteredValue ? dt.filteredValue : this.stats;
    if (campo === 'empresa') {
      return registrosVisibles.length; // Retorna el número de registros visibles
    }
    return registrosVisibles.reduce((acc: number, stat: Stats) => acc + Number(stat[campo as keyof Stats] || 0), 0);
  }
}
