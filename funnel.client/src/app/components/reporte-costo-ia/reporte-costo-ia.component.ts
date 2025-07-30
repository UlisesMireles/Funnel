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
  
  // Filtros
  selectedAnio: number | null = null;
  selectedMes: number | null = null;
  aniosDisponibles: number[] = [];
  mesesDisponibles: number[] = [];
  getReporte() {
    this.reporteCostoIaService.getReporte().subscribe({
      next: (result: ReporteCostoIa[]) => {
        this.reporteOriginal = result;
        this.aniosDisponibles = [...new Set(result.map(item => item.anio))].sort();
        this.mesesDisponibles = [...new Set(result.map(item => item.mes))].sort((a, b) => a - b);
        this.applyFilters();
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

  applyFilters() {
    let filteredData = [...this.reporteOriginal];

    // Aplicar filtro por año si está seleccionado
    if (this.selectedAnio) {
      filteredData = filteredData.filter(item => item.anio === this.selectedAnio);
    }

    // Aplicar filtro por mes si está seleccionado
    if (this.selectedMes) {
      filteredData = filteredData.filter(item => item.mes === this.selectedMes);
    }

    // Consolidar datos por empresa
    const consolidatedData: ReporteCostoIa[] = [];
    const empresas = new Set(filteredData.map(item => item.nombreEmpresa));

    empresas.forEach(empresa => {
      const empresaData = filteredData.filter(item => item.nombreEmpresa === empresa);
      const consolidatedItem: ReporteCostoIa = {
        nombreEmpresa: empresa,
        costoTotalL: empresaData.reduce((sum, item) => sum + (item.costoTotalL || 0), 0),
        tokenEntrada: empresaData.reduce((sum, item) => sum + (item.tokenEntrada || 0), 0),
        tokenSalida: empresaData.reduce((sum, item) => sum + (item.tokenSalida || 0), 0),
        anio: this.selectedAnio || 0, // Mostrar el año filtrado o 0 si no hay filtro
        mes: this.selectedMes || 0 // Mostrar el mes filtrado o 0 si no hay filtro
        ,
        idEmpresa: 0
      };
      consolidatedData.push(consolidatedItem);
    });

    this.reporte = consolidatedData;
    this.first = 0; // Resetear paginación
  }

  onAnioChange() {
    this.applyFilters();
  }

  onMesChange() {
    this.applyFilters();
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
    this.selectedAnio = null;
    this.selectedMes = null;
    this.applyFilters();
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
