import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Administrador } from '../../interfaces/Administrador';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { AdministradoresService } from '../../services/administradores.service';
import { baseOut } from '../../interfaces/utils/baseOut';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-administracion',
  standalone: false,
  templateUrl: './administracion.component.html',
  styleUrl: './administracion.component.css'
})
export class AdministracionComponent {
  loading: boolean = false;
  administradores: Administrador[] = [];
  first: number = 0;
  rows: number = 10;

  modalVisible: boolean = false;
  dataModal: {} = {};

  constructor(private adminService: AdministradoresService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getAdministradores();
  }

  getAdministradores(): void {
    this.adminService.getAdministradores().subscribe({
      next: (data) => {
        this.administradores = data;
      },
      error: (error) => {
        console.error(error);
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

  insertarAdministrador() : void {
    this.dataModal = { isEdicion: false, administrador: {} as Administrador }; 
    this.modalVisible = true;
  }

  editar(admin: Administrador) : void {
    this.dataModal = { isEdicion: true, administrador: admin }; 
    this.modalVisible = true;
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
  @Input() data:any;

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Output() result: EventEmitter<baseOut> = new EventEmitter();

  isEdicion: boolean = false;
  administrador: Administrador = {} as Administrador;
  form!: FormGroup;

  constructor(private fb: FormBuilder, private adminService: AdministradoresService) {
    this.form = this.fb.group({
      idAdministrador: [0],
      nombre: ['', Validators.required],
      usuario: ['', Validators.required],
      correo: ['', Validators.required],
      activo: [true]
    })
  }

  onDialogShow() {
    this.administrador = this.data.administrador;
    this.isEdicion = this.data.isEdicion;
    if(this.isEdicion){
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
        correo: ['', Validators.required],
        activo: [true]
      })
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

  agregarAdmin():void{
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        control?.markAsTouched();
      });
      return;
    }
    const param = this.form.value;
    param.activo = 1;
    param.correoElectronico = param.correo;
    this.adminService.insetarAdministradores(this.form.value).subscribe({
      next: (data) => {
        const resp:baseOut = {id: 0, result:data.result, errorMessage: 'instertar'};
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

  editarAdmin():void{
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
        const resp:baseOut = {id: 0, result:data.result, errorMessage: 'actualiza'};
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
}
