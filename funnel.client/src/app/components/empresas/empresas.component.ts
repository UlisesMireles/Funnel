import { Component, OnInit, ViewChild } from '@angular/core';
import { EmpresasService } from '../../services/empresas.service';
import { Empresa } from '../../interfaces/Empresa';
import { Licencia } from '../../interfaces/Licencia'

import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table'; 

@Component({
  selector: 'app-empresas',
  standalone: false,  
  templateUrl: './empresas.component.html',
  styleUrl: './empresas.component.css'
})
export class EmpresasComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;

  empresas: Empresa[] = []
  licencias: Licencia[] = [];
  licenciasDropdown: { label: string; value: number }[] = [];

  loading: boolean = true;

  first = 0;
  rows = 10;

  searchValue: string = '';

  constructor(private empresasService: EmpresasService) { } 
  ngOnInit() {
    this.getEmpresas();
    console.error("test");
  }

  getEmpresas() {
    this.empresasService.getEmpresas().subscribe({
      next: (result: Empresa[]) => {
        console.log(result); // Verifica la respuesta en consola
        this.empresas = result; // Asigna el array de empresas a la variable
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
      }
    });
  }
  getLicencias() {
    this.empresasService.getLicencias().subscribe({
      next: (result: Licencia[]) => {
        console.log('Datos recibidos:', result);

        // Mantén los datos originales
        this.licencias = result;

        // Transforma los datos para el dropdown
        this.licenciasDropdown = result.map((licencia: any) => ({
          label: licencia.NombreLicencia ? String(licencia.NombreLicencia) : 'Desconocido',
          value: licencia.IdLicencia ?? 0
        }));

        this.loading = false;
      },
      error: (error) => {
        console.error('Error al obtener licencias:', error);
        this.loading = false;
      }
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
  }

  pageChange(event: LazyLoadEvent) {
    if (event.first !== undefined) {
      this.first = event.first;
    }
    if (event.rows !== undefined) {
      this.rows = event.rows;
    }
  }

  isLastPage(): boolean {
    return this.empresas ? this.first + this.rows >= this.empresas.length : true;
  }

  isFirstPage(): boolean {
    return this.empresas ? this.first === 0 : true;
  }
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;  // Casting de tipo
    if (this.dt) {
      this.dt.filterGlobal(input.value, 'contains');
    }
  }
}
