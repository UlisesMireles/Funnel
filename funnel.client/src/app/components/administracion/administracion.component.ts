import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Administrador } from '../../interfaces/Administrador';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { AdministradoresService } from '../../services/administradores.service';
import { baseOut } from '../../interfaces/utils/baseOut';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-administracion',
  standalone: false,
  templateUrl: './administracion.component.html',
  styleUrl: './administracion.component.css'
})
export class AdministracionComponent {
  loading: boolean = true;
  administradores: Administrador[] = [];
  administradoresOriginal: Administrador[] = [];
  first: number = 0;
  rows: number = 10;

  modalVisible: boolean = false;
  dataModal: {} = {};

  EstatusDropdown = [
    { label: 'Todo', value: null },
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];
  selectedEstatus: any = true;
  @ViewChild('dt') dt!: Table;

  constructor(private adminService: AdministradoresService, private messageService: MessageService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getAdministradores();
  }

  getAdministradores(): void {
    this.adminService.getAdministradores().subscribe({
      next: (data) => {
        this.administradoresOriginal = data;
        this.loading = false;
        this.cdr.detectChanges();
        this.selectedEstatus = true;
        this.filtrarPorEstatus();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Se ha producido un error.',
          detail: error.errorMessage,
        });
        this.loading = false;
      }
    });
  }

  pageChange(event: LazyLoadEvent) {
    if (event.first !== undefined) {
      this.first = event.first;
    }
    if (event.rows !== undefined) {
      this.rows = event.rows;
    }
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.getAdministradores();
    this.first = 0;
  }

  getVisibleTotal(campo: string, dt: any): number {
    const registrosVisibles = dt.filteredValue ? dt.filteredValue : this.administradores;
    if (campo === 'nombre') {
      return registrosVisibles.length; // Retorna el número de registros visibles
    }
    return registrosVisibles.reduce((acc: number, licencia: Administrador) => acc + Number(licencia[campo as keyof Administrador] || 0), 0);
  }

  isLastPage(): boolean {
    return this.administradores ? this.first + this.rows >= this.administradores.length : true;
  }

  isFirstPage(): boolean {
    return this.administradores ? this.first === 0 : true;
  }

  onModalClose() {
    this.modalVisible = false;
  }

  resultadoModal(result: baseOut) {
    const isInsert = result.errorMessage === 'instertar';
    const summary = result.result
      ? `Administrador ${isInsert ? 'registrado' : 'actualizado'} correctamente`
      : 'Se ha producido un error.';

    this.messageService.add({
      severity: result.result ? 'success' : 'error',
      summary,
      detail: result.result ? '' : result.errorMessage
    });

    this.getAdministradores();
  }

  insertarAdministrador(): void {
    this.dataModal = { isEdicion: false, administrador: {} as Administrador, admins: this.administradores };
    this.modalVisible = true;
  }

  editar(admin: Administrador): void {
    this.dataModal = { isEdicion: true, administrador: admin };
    this.modalVisible = true;
  }

  filtrarPorEstatus() {
    this.administradores = this.selectedEstatus === null
      ? [...this.administradoresOriginal]
      : [...this.administradoresOriginal.filter(admin =>
        admin.activo === (this.selectedEstatus ? 1 : 0)
      )];
    if (this.dt) {
      this.dt.first = 0;
    }
  }
}

@Component({
  selector: 'agregar-admin-dialog',
  standalone: false,
  templateUrl: './administracionDialog.html',
  styleUrl: './administracion.component.css'
})
export class AdministradorAgregarDialog {
  @Input() visible: boolean = false;
  @Input() data: any;

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Output() result: EventEmitter<baseOut> = new EventEmitter();

  isEdicion: boolean = false;
  administrador: Administrador = {} as Administrador;
  form!: FormGroup;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  admins: Administrador[] = [];

  constructor(private fb: FormBuilder, private adminService: AdministradoresService, private messageService: MessageService) {
    this.form = this.fb.group({
      idAdministrador: [0],
      nombre: ['', Validators.required],
      usuario: ['', Validators.required],
      correo: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      activo: [true]
    })
  }

  onDialogShow() {
    this.administrador = this.data.administrador;
    this.isEdicion = this.data.isEdicion;
    if (this.isEdicion) {
      this.form.patchValue({
        idAdministrador: this.administrador.idAdministrador,
        nombre: this.administrador.nombre,
        usuario: this.administrador.usuario,
        correo: this.administrador.correoElectronico,
        activo: this.administrador.activo == 1 ? true : false
      })
    } else {
      this.form = this.fb.group({
        idAdministrador: [0],
        nombre: ['', Validators.required],
        usuario: ['', Validators.required],
        correo: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
        activo: [true]
      });
      this.admins = this.data.admins;
    }
  }

  esCampoInvalido(campo: string): boolean {
    const control = this.form.get(campo);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.closeModal.emit();
  }

  agregarAdmin(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        control?.markAsTouched();
      });
      return;
    }

    if (this.validaNombreExistente()) {
      this.messageService.clear();
      this.messageService.add({
        severity: 'error',
        summary: 'El Usuario con el nombre ' + this.form.get('nombre')?.value + ' ya existe',
        detail: '',
        life: 2000
      });
      return;
    }

    if (this.validaUsuarioExistente()) {
      this.messageService.clear();
      this.messageService.add({
        severity: 'error',
        summary: 'El Usuario ' + this.form.get('usuario')?.value + ' ya existe',
        detail: '',
        life: 2000
      });
      return;
    }

    if (this.validaCorreoExistente()) {
      this.messageService.clear();
      this.messageService.add({
        severity: 'error',
        summary: 'El correo ' + this.form.get('correo')?.value + ' ya existe',
        detail: '',
        life: 2000
      });
      return;
    }

    const param = this.form.value;
    param.activo = 1;
    param.correoElectronico = param.correo;
    this.adminService.insetarAdministradores(this.form.value).subscribe({
      next: (data) => {
        const resp: baseOut = { id: 0, result: data.result, errorMessage: 'instertar' };
        this.result.emit(resp);
        this.visible = false;
        this.visibleChange.emit(this.visible);
        this.closeModal.emit();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  editarAdmin(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        control?.markAsTouched();
      });
      return;
    }
    const param = this.form.value;
    param.activo = param.activo ? 1 : 0;
    param.correoElectronico = param.correo;
    this.adminService.editarAdministrador(param).subscribe({
      next: (data) => {
        const resp: baseOut = { id: 0, result: data.result, errorMessage: 'actualiza' };
        this.result.emit(resp);
        this.visible = false;
        this.visibleChange.emit(this.visible);
        this.closeModal.emit();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  validaUsuarioExistente(): boolean {
    const usuario = this.form.get('usuario')?.value;
    return this.admins.some((admin) => admin.usuario.toLowerCase() === usuario.toLowerCase());
  }

  validaNombreExistente(): boolean {
    const nombre = this.form.get('nombre')?.value;
    return this.admins.some((admin) => admin.nombre.toLowerCase().trim() === nombre.toLowerCase().trim());
  }

  validaCorreoExistente(): boolean {
    const correo = this.form.get('correo')?.value;
    return this.admins.some((admin) => admin.correoElectronico.toLowerCase().trim() === correo.toLowerCase().trim());
  }
}
