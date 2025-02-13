import { Component, EventEmitter, Input, Output } from '@angular/core';

/*Primeng*/
import { MessageService } from 'primeng/api';

/*Services*/
import { EmpresasService } from '../../../services/empresas.service';

/*Intefaces*/
import { requestEmpresa } from '../../../interfaces/Empresa';
import { baseOut } from '../../../interfaces/utils/baseOut'
import { dataEmpresa } from '../../../interfaces/Empresa';
import { dropdownLicencia } from '../../../interfaces/Licencia';

@Component({
  selector: 'app-modal-empresas',
  standalone: false,
  templateUrl: './modal-empresas.component.html',
  styleUrl: './modal-empresas.component.css'
})
export class ModalEmpresasComponent {
  @Input() title: string = 'Modal';
  @Input() visible: boolean = false;
  @Input() insertar: boolean = false;
  @Input() empresa!: dataEmpresa;
  request!: requestEmpresa;

  empresaActiva: boolean = false;
  licenciasDropdown:dropdownLicencia[] = [];
  selectedLicencia: number | undefined;

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Output() result: EventEmitter<baseOut> = new EventEmitter();

  constructor(private empresasService: EmpresasService, private messageService: MessageService) { }

  onDialogShow() {
    this.getLicencias();
    this.selectedLicencia = this.empresa.idLicencia;
    this.empresaActiva = this.empresa?.activo === 1;
    this.empresa.vInicio = new Date(this.empresa.vInicio);
    this.empresa.vTerminacion = new Date(this.empresa.vTerminacion);

  }
  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.closeModal.emit();
  }

  getLicencias() {
    this.empresasService.getLicencias().subscribe({
      next: (result: dropdownLicencia[]) => {
        this.licenciasDropdown = result;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
      }
    });
  }
  guardarEmpresa() {
    if (!this.request) {
      this.request = {} as requestEmpresa;
    }
    if (!this.validarCampos()) {
      return;
    }
    this.request.idEmpresa = 0;
    this.request.bandera = 'INS-EMPRESA';
    this.request.nombreEmpresa = this.empresa.nombreEmpresa;
    this.request.idAdministrador = 0;
    this.request.idLicencia = this.empresa.idLicencia;
    this.request.alias = this.empresa.alias;
    this.request.rfc = this.empresa.rfc;
    this.request.vInicio = this.empresa.vInicio;
    this.request.vTerminacion = this.empresa.vTerminacion;
    this.request.usuarioCreador = 10;
    this.request.nombre = this.empresa.nombre;
    this.request.apellidoPaterno = this.empresa.apellidoPaterno;
    this.request.apellidoMaterno = this.empresa.apellidoMaterno;
    this.request.iniciales = this.getIniciales();
    this.request.correo = this.empresa.correoAdministrador;
    this.request.usuario = this.empresa.usuarioAdministrador;
    this.request.urlSitio = this.empresa.urlSitio;
    this.request.activo = 1;
    this.empresasService.postINSUPDEmpresa(this.request).subscribe(
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
  actualizaEmpresa() {
    if (!this.request) {
      this.request = {} as requestEmpresa;
    }
    if (!this.validarCampos()) {
      return;
    }
    this.request.idEmpresa = this.empresa.idEmpresa;
    this.request.bandera = 'UPD-EMPRESA';
    this.request.nombreEmpresa = this.empresa.nombreEmpresa;
    this.request.idAdministrador = this.empresa.idAdministrador;
    this.request.idLicencia = this.empresa.idLicencia;
    this.request.alias = this.empresa.alias;
    this.request.rfc = this.empresa.rfc;
    this.request.vInicio = this.empresa.vInicio;
    this.request.vTerminacion = this.empresa.vTerminacion;
    this.request.usuarioCreador = this.empresa.usuarioCreador;
    this.request.nombre = this.empresa.nombre;
    this.request.apellidoPaterno = this.empresa.apellidoPaterno;
    this.request.apellidoMaterno = this.empresa.apellidoMaterno;
    this.request.iniciales = this.getIniciales();
    this.request.correo = this.empresa.correoAdministrador;
    this.request.usuario = this.empresa.usuarioAdministrador;
    this.request.urlSitio = this.empresa.urlSitio;
    this.request.activo = this.empresaActiva ? 1 : 0;
    this.empresasService.postINSUPDEmpresa(this.request).subscribe(
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
  getIniciales(): string {
    const obtenerIniciales = (texto: string | undefined): string|undefined => {
      return texto!
        .trim()
        .split(/\s+/)
        .map(palabra => palabra.charAt(0).toUpperCase())
        .join('');
    };
    const inicialesNombre = obtenerIniciales(this.empresa.nombre);
    const inicialesPaterno = obtenerIniciales(this.empresa.apellidoPaterno);
    const inicialesMaterno = obtenerIniciales(this.empresa.apellidoMaterno);
    return `${inicialesNombre}${inicialesPaterno}${inicialesMaterno}`;
  }
  onAliasChange(newValue: string) {
    this.empresa.usuarioAdministrador = "admin." + newValue;
  }

  validarCampos(): boolean {
    this.messageService.clear();

    if (!this.empresa.nombreEmpresa) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El nombre de la empresa es obligatorio.' });
      return false;
    }
    if (!this.empresa.alias) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El alias es obligatorio.' });
      return false;
    }
    if (!this.empresa.rfc) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El RFC es obligatorio.' });
      return false;
    }
    if (!this.empresa.idLicencia) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La licencia es obligatoria.' });
      return false;
    }
    if (!this.empresa.nombre) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El nombre del administrador es obligatorio.' });
      return false;
    }
    if (!this.empresa.apellidoPaterno) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El apellido paterno es obligatorio.' });
      return false;
    }
    if (!this.empresa.apellidoMaterno) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El apellido materno es obligatorio.' });
      return false;
    }
    if (!this.empresa.usuarioAdministrador) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El usuario es obligatorio.' });
      return false;
    }
    if (!this.empresa.correoAdministrador) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El correo es obligatorio.' });
      return false;
    }
    if (!this.empresa.vInicio) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La fecha de inicio es obligatoria.' });
      return false;
    }
    if (!this.empresa.vTerminacion) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La fecha de terminación es obligatoria.' });
      return false;
    }
    if (this.empresa.vInicio > this.empresa.vTerminacion) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La fecha de inicio no puede ser mayor a la fecha de terminación.' });
      return false;
    }
    return true;
  }

}
