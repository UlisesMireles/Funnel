import { Component, OnInit, ViewChild } from '@angular/core';

/*PrimeNG*/
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';

/*Services*/
import { ReporteCostoIaService } from '../../services/reporte-costo-ia.service';
// Interfaces
import { ReporteCostoIa } from '../../interfaces/reporte-costo-ia';
@Component({
  selector: 'app-reporte-costo-ia',
  standalone: false,
  templateUrl: './reporte-costo-ia.component.html',
  styleUrl: './reporte-costo-ia.component.css'
})
export class ReporteCostoIaComponent {ngOnInit(): void {
    this.getReporte();
  }
  constructor(private reporteCostoIaService: ReporteCostoIaService,
      private messageService: MessageService) {
  }
  @ViewChild('dt') dt!: Table; // Referencia a la tabla


  reporte: ReporteCostoIa[] = [];
  reporteOriginal: ReporteCostoIa[] = [];

 
  loading: boolean = true;
  modalVisible: boolean = false;
  insertar: boolean = false;
  first: number = 0;
  rows: number = 10;
  searchValue: string = '';
  
  getReporte() {
    this.reporteCostoIaService.getReporte().subscribe({
      next: (result: ReporteCostoIa[]) => {
        this.reporte = result;
        this.reporteOriginal = result;
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
  
  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
    this.dt.reset();
    this.getReporte();
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
    const registrosVisibles = dt.filteredValue ? dt.filteredValue : this.reporte;
    if (campo === 'nombreEmpresa') {
      return registrosVisibles.length; // Retorna el número de registros visibles
    }
    return registrosVisibles.reduce((acc: number, reporte: ReporteCostoIa) => acc + Number(reporte[campo as keyof ReporteCostoIa] || 0), 0);
  }
}
