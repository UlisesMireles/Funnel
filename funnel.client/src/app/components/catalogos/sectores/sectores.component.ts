import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

//PrimeNG
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';

//Services
import { SectoresService } from '../../../services/sectores.service';

// Interfaces
import { requestLicencia } from '../../../interfaces/Licencia';
import { baseOut } from '../../../interfaces/utils/baseOut';
import { SEL_Sectores } from '../../../interfaces/Sector';

@Component({
  selector: 'app-sectores',
  standalone: false,

  templateUrl: './sectores.component.html',
  styleUrl: './sectores.component.css',
})
export class SectoresComponent {
  constructor(
    private sectoresService: SectoresService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getSectores();
  }
  @ViewChild('dt') dt!: Table; // Referencia a la tabla

  sectores: SEL_Sectores[] = [];
  sectoresOriginal: SEL_Sectores[] = [];
  sectorSeleccionado!: SEL_Sectores;

  filtroSector='';
  filtrODescSector='';
  filtroFechaCreacion='';
  filtroUsuarioCreador='';
  filtroFechaModificacion='';
  filtroUsuarioModifico='';
  first: number = 0;
  rows: number = 10;
  loading: boolean = true;
  insertar: boolean = false;
  modalVisible: boolean = false;
  selectedEstatus: any = null;

  EstatusDropdown = [
    { label: 'Todo', value: null },
    { label: 'Activo', value: 'Activo' },
    { label: 'Inactivo', value: 'Inactivo' },
  ];
  rowsOptions = [
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '50', value: 50 }
  ];
  getSectores() {
    this.sectoresService.getSectores().subscribe({
      next: (result: SEL_Sectores[]) => {
        this.sectoresOriginal = result;
        this.selectedEstatus = 'Activo';
        this.cdr.detectChanges();
        this.loading = false;
        this.FiltrarPorEstatus();
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
    this.sectores = this.selectedEstatus === null
      ? [...this.sectoresOriginal]
      : [...this.sectoresOriginal.filter((x) => x.desEstatusActivo === this.selectedEstatus)];
    if (this.dt) {
      this.dt.first = 0;
    }
  }
  // eventosBotones
  inserta() {
    this.sectorSeleccionado = {
      idSector: 0,
      nombreSector: '',
      descripcionSector: '',
      fechaCreacion: '',
      usuarioCreador: '',
      fechaModificacion: '',
      usuarioModifico: '',
      desEstatusActivo: '',
    };
    this.insertar = true;
    this.modalVisible = true;
  }
  actualiza(licencia: SEL_Sectores) {
    this.sectorSeleccionado = licencia;
    this.insertar = false;
    this.modalVisible = true;
  }
  updateFilter(event: any, field: string) {
    this.dt.filter(event, field, 'contains');
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
  changeRows(event: any, dt: any) {
    this.rows = event.value;
    dt.rows = this.rows;
    dt.first = 0;
    dt.reset();
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
    this.getSectores();
    this.dt.reset();
  }
  next() {
    this.first = this.first + this.rows;
  }
  isFirstPage(): boolean {
    return this.sectores ? this.first === 0 : true;
  }
  getVisibleTotal(campo: string, dt: any): number {
    const registrosVisibles = dt.filteredValue
      ? dt.filteredValue
      : this.sectores;
    if (campo === 'nombreSector') {
      return registrosVisibles.length; // Retorna el número de registros visibles
    }
    return registrosVisibles.reduce(
      (acc: number, empresa: SEL_Sectores) =>
        acc + Number(empresa[campo as keyof SEL_Sectores] || 0),
      0
    );
  }
  isLastPage(): boolean {
    return this.sectores
      ? this.first + this.rows >= this.sectores.length
      : true;
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
      this.getSectores();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Se ha producido un error.',
        detail: result.errorMessage,
      });
    }
  }
}
