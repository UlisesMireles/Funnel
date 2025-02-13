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
}
