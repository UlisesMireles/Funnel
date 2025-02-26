import { Component, EventEmitter, Input, Output } from '@angular/core';

/*Primeng*/
import { MessageService } from 'primeng/api';

// Interfaces
import { requestSector } from '../../../../interfaces/Sector';
import { baseOut } from '../../../../interfaces/utils/baseOut';
import { SEL_Sectores } from '../../../../interfaces/Sector';

// Services
import { SectoresService } from '../../../../services/sectores.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-sectores',
  standalone: false,

  templateUrl: './modal-sectores.component.html'
})
export class ModalSectoresComponent {

  constructor(private sectoresService: SectoresService, private messageService: MessageService, private fb: FormBuilder) {
    this.userId = parseInt(localStorage.getItem('currentUser')!);
    this.form = this.fb.group({
      idSector: [0],
      bandera: ['INS-SECTOR'],
      nombreSector: ['', Validators.required],
      descripcionSector: ['', Validators.required],
      idUsuarioCreador: [this.userId],
      activo: [1]
    });
  }

  @Input() sector!: SEL_Sectores;
  @Input() sectores: SEL_Sectores[] = [];
  @Input() title: string = 'Modal';
  @Input() visible: boolean = false;
  @Input() insertar: boolean = false;
  request!: requestSector;

  form!: FormGroup;
  userId: number = 0;

  sectorActivo: boolean = false;
  selectedLicencia: number | undefined;

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Output() result: EventEmitter<baseOut> = new EventEmitter();

  onDialogShow() {
    this.sectorActivo = this.sector?.desEstatusActivo === 'Activo';
    if (this.insertar) {
      this.form = this.fb.group({
        idSector: [0],
        bandera: ['INS-SECTOR'],
        nombreSector: ['', Validators.required],
        descripcionSector: ['', Validators.required],
        idUsuarioCreador: [this.userId],
        activo: [1]
      });
    } else {
      this.form = this.fb.group({
        idSector: [this.sector.idSector],
        bandera: ['UPD-SECTOR'],
        nombreSector: [this.sector.nombreSector, Validators.required],
        descripcionSector: [this.sector.nombreSector, Validators.required],
        idUsuarioCreador: [this.userId],
        activo: [this.sectorActivo]
      });
    }
  }
  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.closeModal.emit();
  }
  actualizaSector() {
    if (this.camposInvalidosEditar()) {
      this.mostrarToastError();
      return;
    }

    this.form.controls['activo'].setValue(this.form.controls['activo'].value ? 1 : 0);
    this.sectoresService.postINSUPDSector(this.form.value).subscribe(
      {
        next: (result: baseOut) => {
          this.result.emit(result);
          this.visible = false;
          this.visibleChange.emit(this.visible);
          this.closeModal.emit();
        },
        error: (error: baseOut) => {
          this.result.emit(error);
          this.visible = false;
          this.visibleChange.emit(this.visible);
          this.closeModal.emit();
        }
      }
    );
  }
  guardarSector() {
    if (this.camposInvalidosInsertar()) {
      this.mostrarToastError();
      return;
    }
    this.sectoresService.postINSUPDSector(this.form.value).subscribe(
      {
        next: (result: baseOut) => {
          this.result.emit(result);
          this.visible = false;
          this.visibleChange.emit(this.visible);
          this.closeModal.emit();
        },
        error: (error: baseOut) => {
          this.result.emit(error);
          this.visible = false;
          this.visibleChange.emit(this.visible);
          this.closeModal.emit();
        }
      }
    );
  }
  validarSector(): boolean {
    const nombreSector = this.form.get('nombreSector')?.value;
    if (this.sectores.some(sector => sector.nombreSector?.toLowerCase().trim() === nombreSector.toLowerCase().trim())) {
      return false;
    }
    return true;
  }
  esCampoInvalido(campo: string): boolean {
    const control = this.form.get(campo);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }

  camposInvalidosInsertar(): boolean {
    return (
      this.esCampoInvalido('nombreSector') ||
      this.esCampoInvalido('descripcionSector') ||
      !this.validarSector()
    );
  }
  camposInvalidosEditar(): boolean {
    return (
      this.esCampoInvalido('nombreSector') ||
      this.esCampoInvalido('descripcionSector')
    );
  }

  /**
   * Método para mostrar un toast de error cuando hay campos vacíos.
   */
  mostrarToastError() {
    let mensaje = 'Es Necesario llenar los campos indicados.';
    this.messageService.clear();
    if (!this.validarSector() && this.insertar) {
      mensaje = 'El Sector ya existe.';
    }
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: mensaje,
    });
  }
}
