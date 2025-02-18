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
  rowsOptions = [
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '50', value: 50 }
  ];
  selectedEstatus: any = true;
  loading: boolean = true;
  modalVisible: boolean = false;
  insertar: boolean = false;
  first: number = 0;
  rows: number = 10;
  searchValue: string = '';
  filterEmpresas = '';
  filterAlias = '';
  filterUrl= '';
  filterLicencia = '';

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

        this.selectedEstatus = true;
        setTimeout(() => {
          if (this.dt) {
            this.dt.filter(true, 'activo', 'equals');
          }
        }, 300);
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
  changeRows(event: any, dt: any) {
    this.rows = event.value;
    dt.rows = this.rows;
    dt.first = 0;
    dt.reset();
  }
  applyFilter(value: any, field: string) {
    this.dt.filter(value, field, 'equals');
  }
  updateFilter(event: any, field: string) {
    this.dt.filter(event, field, 'contains');
  }
  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.filterAlias = '';
    this.filterEmpresas='';
    this.filterLicencia='';
    this.filterUrl='';
    this.first = 0;
    this.getEmpresas();
    this.dt.reset();
  }
  getVisibleTotal(campo: string, dt: any): number {
    const registrosVisibles = dt.filteredValue ? dt.filteredValue : this.empresas;
    if (campo === 'nombreEmpresa') {
      return registrosVisibles.length; // Retorna el número de registros visibles
    }
    return registrosVisibles.reduce((acc: number, empresa: dataEmpresa) => acc + Number(empresa[campo as keyof dataEmpresa] || 0), 0);
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
