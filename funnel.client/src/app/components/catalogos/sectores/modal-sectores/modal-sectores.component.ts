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

  templateUrl: './modal-sectores.component.html',
  styleUrl: './modal-sectores.component.css'
})
export class ModalSectoresComponent {

  constructor(private sectoresService : SectoresService, private messageService: MessageService) { }
  @Input() sector!: SEL_Sectores;
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
        if (this.camposInvalidos()) {
          this.mostrarToastError();
          return;
        }
        this.request.bandera = 'UPD-SECTOR';
        this.request.idSector = this.sector.idSector;
        this.request.nombreSector = this.sector.nombreSector;
        this.request.descripcionSector= this.sector.descripcionSector;
        this.request.idUsuarioCreador = parseInt(localStorage.getItem('currentUser') || '0', 10);
        this.request.activo = this.sectorActivo ? 1 : 0;
        console.log(this.request);
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
        if (this.camposInvalidos()) {
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
      esCampoInvalido(valor: any): boolean {
        return valor === null || valor === undefined || valor === '' || valor <= 0;
      }
      camposInvalidos(): boolean {
        return (
          this.esCampoInvalido(this.sector.nombreSector) ||
          this.esCampoInvalido(this.sector.descripcionSector)
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
