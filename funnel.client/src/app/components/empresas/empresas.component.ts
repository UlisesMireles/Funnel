import { Component, OnInit, ViewChild } from '@angular/core';

/*PrimeNG*/
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';

/*Services*/
import { EmpresasService } from '../../services/empresas.service';

/*Interfaces*/
import { dataEmpresa } from '../../interfaces/Empresa';
import { baseOut } from '../../interfaces/utils/baseOut';

@Component({
  selector: 'app-empresas',
  standalone: false,
  templateUrl: './empresas.component.html',
  styleUrl: './empresas.component.css',
})
export class EmpresasComponent implements OnInit {
  @ViewChild('dt') dt!: Table; // Referencia a la tabla

  empresas: dataEmpresa[] = [];
  empresaSeleccionada!: dataEmpresa;

  licenciasDropdown: { label: string; value: number }[] = [];
  EstatusDropdown = [
    { label: 'Todo', value: null },
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  selectedEstatus: any = null;
  loading: boolean = true;
  modalVisible: boolean = false;
  insertar: boolean = false;
  first: number = 0;
  rows: number = 10;
  searchValue: string = '';

  constructor(
    private empresasService: EmpresasService,
    private messageService: MessageService
  ) {}
  ngOnInit() {
    this.getEmpresas();
  }

  getEmpresas() {
    this.empresasService.getEmpresas().subscribe({
      next: (result: dataEmpresa[]) => {
        this.empresas = result;

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
    if (this.selectedEstatus == null) {
      this.dt.filter('', 'activo', 'equals');
      this.dt.filterGlobal('', 'contains');
    } else {
      this.dt.filter(this.selectedEstatus, 'activo', 'equals');
    }
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
    return this.empresas
      ? this.first + this.rows >= this.empresas.length
      : true;
  }

  isFirstPage(): boolean {
    return this.empresas ? this.first === 0 : true;
  }
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement; // Casting de tipo
    if (this.dt) {
      this.dt.filterGlobal(input.value, 'contains');
    }
  }

  actualiza(empresa: dataEmpresa) {
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
      urlSitio: 'www.',
      cantidadOportunidades: 0,
      idAdministrador: 0,
      userReal: 0,
      oportEmp: 0,
      oportAct: 0,
      activo: 0, // Si representa activo/inactivo (1/0)
      usuarioCreador: 0,
    } as dataEmpresa;
    this.insertar = true;
    this.modalVisible = true;
  }
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
      this.getEmpresas();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Se ha producido un error.',
        detail: result.errorMessage,
      });
    }
  }
}
