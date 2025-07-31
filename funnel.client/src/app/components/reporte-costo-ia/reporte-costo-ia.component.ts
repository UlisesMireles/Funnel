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
  selectedAnio: any = {value: null, label: 'Todos los años'};
  selectedMes: any = {value: null, label: 'Todos los meses'};
  aniosDisponibles: any[] = [];
  mesesDisponibles: any[] = [];
    getReporte() {
    this.reporteCostoIaService.getReporte().subscribe({
      next: (result: ReporteCostoIa[]) => {
        this.reporteOriginal = result;
        
        const aniosUnicos = [...new Set(result.map(item => item.anio))].sort((a, b) => b - a); 
        this.aniosDisponibles = [
          {value: null, label: 'Todos los años'},
          ...aniosUnicos.map(anio => ({value: anio, label: anio.toString()}))
        ];
        
        const mesesUnicos = [...new Set(result.map(item => item.mes))].sort((a, b) => a - b);
        this.mesesDisponibles = [
          {value: null, label: 'Todos los meses'},
          ...mesesUnicos.map(mes => ({value: mes, label: this.getNombreMes(mes)}))
        ];
        
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al obtener el reporte'
        });
        this.loading = false;
      }
    });
  }


   getNombreMes(mes: number): string {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[mes - 1] || mes.toString();
  }

  applyFilters() {
    let filteredData = [...this.reporteOriginal];

    if (this.selectedAnio.value !== null) {
      filteredData = filteredData.filter(item => item.anio === this.selectedAnio.value);
    }

    if (this.selectedMes.value !== null) {
      filteredData = filteredData.filter(item => item.mes === this.selectedMes.value);
    }

    const empresasUnicas = [...new Set(filteredData.map(item => item.nombreEmpresa))];
    
    this.reporte = empresasUnicas.map(empresa => {
      const datosEmpresa = filteredData.filter(item => item.nombreEmpresa === empresa);
      return {
        nombreEmpresa: empresa,
        costoTotalL: datosEmpresa.reduce((sum, item) => sum + (item.costoTotalL || 0), 0),
        tokenEntrada: datosEmpresa.reduce((sum, item) => sum + (item.tokenEntrada || 0), 0),
        tokenSalida: datosEmpresa.reduce((sum, item) => sum + (item.tokenSalida || 0), 0),
        anio: this.selectedAnio.value || 'Todos', 
        mes: this.selectedMes.value || 'Todos', 
        idEmpresa: datosEmpresa[0]?.idEmpresa || 0
      };
    });

    this.reporte.sort((a, b) => a.nombreEmpresa.localeCompare(b.nombreEmpresa));
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
    this.selectedAnio = {value: null, label: 'Todos los años'};
    this.selectedMes = {value: null, label: 'Todos los meses'};
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
