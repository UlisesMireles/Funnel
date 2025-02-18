import { Component, EventEmitter, Input, Output } from '@angular/core';

/*Primeng*/
import { MessageService } from 'primeng/api';

// Interfaces
import { requestSector } from '../../../../interfaces/Sector';
import { baseOut } from '../../../../interfaces/utils/baseOut';
import { SEL_Sectores } from '../../../../interfaces/Sector';

// Services
import { SectoresService } from '../../../../services/sectores.service';

@Component({
  selector: 'app-modal-sectores',
  standalone: false,

  templateUrl: './modal-sectores.component.html'
})
export class ModalSectoresComponent {

  constructor(private sectoresService : SectoresService, private messageService: MessageService) { }
  @Input() sector!: SEL_Sectores;
  @Input() sectores: SEL_Sectores[]=[];
  @Input() title: string = 'Modal';
  @Input() visible: boolean = false;
  @Input() insertar: boolean = false;
  request!: requestSector;

  sectorActivo: boolean = false;
  selectedLicencia: number | undefined;

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Output() result: EventEmitter<baseOut> = new EventEmitter();

  onDialogShow() {
    this.sectorActivo = this.sector?.desEstatusActivo === 'Activo';
  }
   close() {
      this.visible = false;
      this.visibleChange.emit(this.visible);
      this.closeModal.emit();
    }
    actualizaSector() {
        if (!this.request) {
          this.request = {} as requestSector;
        }
        if (this.camposInvalidosEditar()) {
          this.mostrarToastError();
          return;
        }
        this.request.bandera = 'UPD-SECTOR';
        this.request.idSector = this.sector.idSector;
        this.request.nombreSector = this.sector.nombreSector;
        this.request.descripcionSector= this.sector.descripcionSector;
        this.request.idUsuarioCreador = parseInt(localStorage.getItem('currentUser') || '0', 10);
        this.request.activo = this.sectorActivo ? 1 : 0;

        this.sectoresService.postINSUPDSector(this.request).subscribe(
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
      guardarSector(){
        if (!this.request) {
          this.request = {} as requestSector;
        }
        if (this.camposInvalidosInsertar()) {
          this.mostrarToastError();
          return;
        }
        this.request.bandera = 'INS-SECTOR';
        this.request.idSector = this.sector.idSector;
        this.request.nombreSector = this.sector.nombreSector;
        this.request.descripcionSector= this.sector.descripcionSector;
        this.request.idUsuarioCreador = parseInt(localStorage.getItem('currentUser') || '0', 10);
        this.request.activo = this.sectorActivo ? 1 : 0;
        this.sectoresService.postINSUPDSector(this.request).subscribe(
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
      validarSector(): boolean {
        if (this.sectores.some(sector => sector.nombreSector === this.sector.nombreSector)) {
          return false;
        }
        return true;
      }
      esCampoInvalido(valor: any): boolean {
        return valor === null || valor === undefined || valor === '' || valor <= 0;
      }
      camposInvalidosInsertar(): boolean {
        return (
          this.esCampoInvalido(this.sector.nombreSector) ||
          this.esCampoInvalido(this.sector.descripcionSector)||
          !this.validarSector()
        );
      }
      camposInvalidosEditar(): boolean {
        return (
          this.esCampoInvalido(this.sector.nombreSector) ||
          this.esCampoInvalido(this.sector.descripcionSector)
        );
      }

      /**
       * Método para mostrar un toast de error cuando hay campos vacíos.
       */
      mostrarToastError() {
        let mensaje='Es Necesario llenar los campos indicados.';
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
