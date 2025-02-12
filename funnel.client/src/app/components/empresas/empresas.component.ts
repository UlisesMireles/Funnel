import { Component, OnInit, ViewChild } from '@angular/core';
import { EmpresasService } from '../../services/empresas.service';
import { Empresa } from '../../interfaces/sel_Empresa';
import { Licencia } from '../../interfaces/Licencia';

import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table'; 

@Component({
  selector: 'app-empresas',
  standalone: false,
  templateUrl: './empresas.component.html',
  styleUrl: './empresas.component.css'
})
export class EmpresasComponent implements OnInit {
  @ViewChild('dt') dt!: Table; // Referencia a la tabla

  empresas: Empresa[] = []
  licencias: Licencia[] = [];
  empresaSeleccionada!: Empresa;
  insertar: boolean =false;

  licenciasDropdown: { label: string; value: number }[] = [];
  EstatusDropdown = [
    { label: 'Todo', value: null },
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false }
  ];
  selectedEstatus: any=null;

  loading: boolean = true;
  modalVisible: boolean = false;

  first: number = 0;
  rows :number = 10;

  searchValue: string = '';

  constructor(private empresasService: EmpresasService) { }
  ngOnInit() {
    this.getEmpresas();

  }

  FiltrarPorEstatus() {
    if (this.selectedEstatus == null) {
      // Si no se seleccionó un filtro de estatus, limpia el filtro 'activo'
      this.dt.filter('', 'activo', 'equals'); // Limpia el filtro específico de la columna 'activo'
      this.dt.filterGlobal('', 'contains'); // Limpia el filtro global de texto (si lo tienes)
    } else {
      this.dt.filter(this.selectedEstatus, 'activo', 'equals'); // Filtra según el valor de estatus
    }
  }

  getEmpresas() {
    this.empresasService.getEmpresas().subscribe({
      next: (result: Empresa[]) => {
       
        this.empresas = result;
        
        this.loading = false;
      },
      error: (error) => {
       
        this.loading = false;
      }
    });
  }

  applyFilter(value: any, field: string) {
    this.dt.filter(value, field, 'equals');
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

  actualiza(empresa: Empresa) {
    this.empresaSeleccionada = empresa;
    this.insertar = false;
    this.modalVisible = true;
  }
  inserta() {
    this.empresaSeleccionada = this.empresaSeleccionada = {
      idEmpresa: 0,
      vInicio: new Date(),
      vTerminacion: new Date(),
      idLicencia: 1,
      cantidadUsuarios: 0,
      urlSitio:'www.',
      cantidadOportunidades: 0,
      idAdministrador: 0,
      userReal: 0,
      oportEmp: 0,
      oportAct: 0,
      activo: 0, // Si representa activo/inactivo (1/0)
      usuarioCreador: 0
    } as Empresa;
    this.insertar = true;
    this.modalVisible = true;
  }
  onModalClose() {
    this.modalVisible = false;
   
  }
}
