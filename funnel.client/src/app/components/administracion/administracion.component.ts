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
        console.log(data);
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
    if (result.result) {
      this.messageService.add({ severity: 'success', summary: 'La operación se realizó con éxito.', detail: result.errorMessage });
      this.getAdministradores();
    } else {
      this.messageService.add({ severity: 'error', summary: 'Se ha producido un error.', detail: result.errorMessage });
    }
  }

  insertarAdministrador() : void {
    console.log('Insertar administrador');
    this.dataModal = { isEdicion: false, administrador: {} as Administrador }; 
    this.modalVisible = true;
  }

  editar(admin: Administrador) : void {
    console.log(admin);
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

  constructor(private fb: FormBuilder) {
    console.log(this.data);
    this.form = this.fb.group({
      idInformacion: [0],
      nombre: ['', Validators.required],
      usuario: ['', Validators.required],
      correo: ['', Validators.required]
    })
  }

  onDialogShow() {
    console.log('Dialog show');
    this.administrador = this.data.administrador;
    this.isEdicion = this.data.isEdicion;
    if(this.isEdicion){
      this.form.patchValue({
        idInformacion: this.administrador.idAdministrador,
        nombre: this.administrador.nombre,
        usuario: this.administrador.usuario,
        correo: this.administrador.correoElectronico
      })
    } else {
      this.form = this.fb.group({
        idInformacion: [0],
        nombre: ['', Validators.required],
        usuario: ['', Validators.required],
        correo: ['', Validators.required]
      })
    }
    console.log(this.data);
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.closeModal.emit();
  }

  agregarAdmin():void{
    console.log(this.form.value);
  }

  editarAdmin():void{
  }
}
