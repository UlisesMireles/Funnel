import { Component, OnInit, ViewChild } from '@angular/core';

//PrimeNG
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';

// Servicios
import { LicenciasService } from './../../services/licencias.service';

// Interfaces
import { baseOut } from '../../interfaces/utils/baseOut';
import { SEL_Licencia } from '../../interfaces/Licencia';

@Component({
  selector: 'app-licencias',
  standalone: false,

  templateUrl: './licencias.component.html',
  styleUrl: './licencias.component.css',
})
export class LicenciasComponent implements OnInit {
  constructor(private licenciasService: LicenciasService, private messageService: MessageService) {}
    @ViewChild('dt') dt!: Table; // Referencia a la tabla

  licencias: SEL_Licencia []  =[];
  licenciaSeleccionada!: SEL_Licencia;

  first:number=0;
  rows:number=10;
  loading: boolean = true;
  insertar: boolean = false;
  modalVisible: boolean = false;
  ngOnInit(): void {
    this.getLicencias();
  }

  //Peticiones
  getLicencias() {
    this.licenciasService.getLicencias().subscribe({
      next: (result: SEL_Licencia[]) => {
        this.licencias = result;
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
  // eventosBotones
    inserta() {
      this.licenciaSeleccionada = {
        idLicencia: 0,
        nombreLicencia: '',
        cantidadUsuarios: 0,
        cantidadOportunidades: 0
      }
      this.insertar = true;
      this.modalVisible = true;
    }
  actualiza(licencia: SEL_Licencia) {
    this.licenciaSeleccionada = licencia;
    this.insertar = false;
    this.modalVisible = true;
  }
  // eventosTabla
    pageChange(event: LazyLoadEvent) {
      if (event.first !== undefined) {
        this.first = event.first;
      }
      if (event.rows !== undefined) {
        this.rows = event.rows;
      }
    }
    onInput(event: Event): void {
      const input = event.target as HTMLInputElement; // Casting de tipo
      if (this.dt) {
        this.dt.filterGlobal(input.value, 'contains');
      }
    }

    prev() {
      this.first = this.first - this.rows;
    }
    reset() {
      this.first = 0;
    }
    next() {
      this.first = this.first + this.rows;
    }
    isFirstPage(): boolean {
      return this.licencias ? this.first === 0 : true;
    }
    isLastPage(): boolean {
      return this.licencias
        ? this.first + this.rows >= this.licencias.length
        : true;
    }
    getVisibleTotal(campo: string, dt: any): number {
      const registrosVisibles = dt.filteredValue ? dt.filteredValue : this.licencias;
      if (campo === 'nombreLicencia') {
        return registrosVisibles.length; // Retorna el número de registros visibles
      }
      return registrosVisibles.reduce((acc: number, licencia: SEL_Licencia) => acc + Number(licencia[campo as keyof SEL_Licencia] || 0), 0);
    }
    // metodos moda
    onModalClose() {
      this.modalVisible = false;
    }
    manejarResultado(result: baseOut) {
      if (result.result) {
        this.messageService.add({
          severity: 'success',
          summary: 'La operación se realizó con éxito.',
          detail: result.errorMessage,
        });
        this.getLicencias();
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Se ha producido un error.',
          detail: result.errorMessage,
        });
      }
    }
}
