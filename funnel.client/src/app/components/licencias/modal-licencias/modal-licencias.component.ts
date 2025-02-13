import { Component, EventEmitter, Input, Output } from '@angular/core';

/*Primeng*/
import { MessageService } from 'primeng/api';

// Interfaces
import { requestLicencia } from '../../../interfaces/Licencia';
import { baseOut } from '../../../interfaces/utils/baseOut';
import { SEL_Licencia } from '../../../interfaces/Licencia';

// Services
import { LicenciasService } from '../../../services/licencias.service';

@Component({
  selector: 'app-modal-licencias',
  standalone: false,

  templateUrl: './modal-licencias.component.html',
  styleUrl: './modal-licencias.component.css'
})
export class ModalLicenciasComponent {

    constructor(private licenciaService : LicenciasService, private messageService: MessageService) { }
  @Input() licencia!: SEL_Licencia;
  @Input() title: string = 'Modal';
  @Input() visible: boolean = false;
  @Input() insertar: boolean = false;
  request!: requestLicencia;

  empresaActiva: boolean = false;
  selectedLicencia: number | undefined;

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Output() result: EventEmitter<baseOut> = new EventEmitter();

  onDialogShow() {

  }
  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.closeModal.emit();
  }
  actualizaLicencia() {
      if (!this.request) {
        this.request = {} as requestLicencia;
      }
      if (this.camposInvalidos()) {
        this.mostrarToastError();
        return;
      }
      this.request.bandera = 'UPD-LICENCIA';
      this.request.idLicencia = this.licencia.idLicencia;
      this.request.cantidadUsuarios = this.licencia.cantidadUsuarios;
      this.request.cantidadOportunidades = this.licencia.cantidadOportunidades;
      this.request.idUsuario = localStorage.getItem('currentUser') as unknown as number;
      this.request.nombreLicencia = this.licencia.nombreLicencia;
      this.licenciaService.postINSUPDLicencia(this.request).subscribe(
        {
          next: (result: baseOut) => {
            this.result.emit(result);
            this.visible = false;
            this.visibleChange.emit(this.visible);
            this.closeModal.emit();
          },
          error: (error: baseOut)=> {
            this.result.emit(error);
            this.visible = false;
            this.visibleChange.emit(this.visible);
            this.closeModal.emit();
          }
        }
      );
    }
    guardarLicencia(){
      if (!this.request) {
        this.request = {} as requestLicencia;
      }
      if (this.camposInvalidos()) {
        this.mostrarToastError();
        return;
      }
      this.request.bandera = 'INS-LICENCIA';
      this.request.idLicencia = this.licencia.idLicencia;
      this.request.cantidadUsuarios = this.licencia.cantidadUsuarios;
      this.request.cantidadOportunidades = this.licencia.cantidadOportunidades;
      this.request.idUsuario = localStorage.getItem('currentUser') as unknown as number;
      this.request.nombreLicencia = this.licencia.nombreLicencia;
      this.licenciaService.postINSUPDLicencia(this.request).subscribe(
        {
          next: (result: baseOut) => {
            this.result.emit(result);
            this.visible = false;
            this.visibleChange.emit(this.visible);
            this.closeModal.emit();
          },
          error: (error: baseOut)=> {
            this.result.emit(error);
            this.visible = false;
            this.visibleChange.emit(this.visible);
            this.closeModal.emit();
          }
        }
      );
    }
    esCampoInvalido(valor: any): boolean {
      return valor === null || valor === undefined || valor === '' || valor <= 0;
    }
    camposInvalidos(): boolean {
      return (
        this.esCampoInvalido(this.licencia.nombreLicencia) ||
        this.esCampoInvalido(this.licencia.cantidadUsuarios) ||
        this.esCampoInvalido(this.licencia.cantidadOportunidades)
      );
    }
    
    /**
     * Método para mostrar un toast de error cuando hay campos vacíos.
     */
    mostrarToastError() {
      this.messageService.clear();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Es Necesario llenar los campos indicados.',
      });
    }
}
