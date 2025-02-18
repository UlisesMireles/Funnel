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
  templateUrl: './modal-empresas.component.html'
})
export class ModalEmpresasComponent {
  @Input() title: string = 'Modal';
  @Input() visible: boolean = false;
  @Input() insertar: boolean = false;
  @Input() empresa!: dataEmpresa;
  @Input() empresas: dataEmpresa[] = [];
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
    if (this.camposInvalidosInsertar()) {
      this.mostrarToastError();
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
    if (this.camposInvalidosEditar()) {
      this.mostrarToastError();
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
  esCampoInvalido(valor: any): boolean {
    return valor === null || valor === undefined || valor === '' || valor <= 0;
  }
  camposInvalidosInsertar(): boolean {
    return (
      this.esCampoInvalido(this.empresa.nombreEmpresa) ||
      this.esCampoInvalido(this.empresa.alias) ||
      this.esCampoInvalido(this.empresa.urlSitio) ||
      this.esCampoInvalido(this.empresa.rfc) ||
      this.esCampoInvalido(this.empresa.idLicencia) ||
      this.esCampoInvalido(this.empresa.nombre) ||
      this.esCampoInvalido(this.empresa.vInicio) ||
      this.esCampoInvalido(this.empresa.vTerminacion) ||
      !this.validarFechas()||
      !this.validarNombreEmpresa()||
      (this.empresa.rfc !== undefined && !this.validarRFC(this.empresa.rfc))||
      (this.empresa.correoAdministrador !== undefined && !this.validarCorreo(this.empresa.correoAdministrador))
    );
  }
  camposInvalidosEditar(): boolean {
    return (
      this.esCampoInvalido(this.empresa.nombreEmpresa) ||
      this.esCampoInvalido(this.empresa.alias) ||
      this.esCampoInvalido(this.empresa.urlSitio) ||
      this.esCampoInvalido(this.empresa.rfc) ||
      this.esCampoInvalido(this.empresa.idLicencia) ||
      this.esCampoInvalido(this.empresa.nombre) ||
      this.esCampoInvalido(this.empresa.vInicio) ||
      this.esCampoInvalido(this.empresa.vTerminacion)||
      (this.empresa.rfc !== undefined && !this.validarRFC(this.empresa.rfc))
    );
  }

  /**
   * Método para validar que vInicio sea menor a vTerminacion.
   */
  validarFechas(): boolean {
    if (!this.empresa.vInicio || !this.empresa.vTerminacion) {
      return true; // No validar si las fechas están vacías
    }
    return new Date(this.empresa.vInicio) < new Date(this.empresa.vTerminacion);
  }
  validarNombreEmpresa(): boolean {
    if (this.empresas.some(empresa => empresa.nombreEmpresa?.toUpperCase() === this.empresa.nombreEmpresa?.toUpperCase())) {
      return false;
    }
    return true;
  }

  validarAlias(): boolean {
    if (this.empresas.some(empresa => empresa.alias?.toUpperCase() === this.empresa.alias?.toUpperCase())) {
      return false;
    }
    return true;
  }
  validarRFC(rfc: string): boolean {
    const regexRFC = /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/;
    return regexRFC.test(rfc);
  }
  validarCorreo(correo: string): boolean {
    // Expresión regular para validar un correo electrónico
    const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regexCorreo.test(correo);
  }
  /**
   * Método para mostrar un toast de error cuando hay campos vacíos o fechas incorrectas.
   */
  mostrarToastError() {
    this.messageService.clear();
    let mensaje = 'Es necesario llenar los campos indicados.';

    if (!this.validarFechas()) {
      mensaje = 'La fecha de inicio debe ser menor a la fecha de terminación.';
    }
    if (!this.validarNombreEmpresa() && this.insertar) {
      mensaje = 'El nombre de la empresa ya existe.';
    }
    if (!this.validarAlias() && this.insertar) {
      mensaje = 'El alias de la empresa ya existe.';
    }
    if (this.empresa.rfc !== undefined && !this.validarRFC(this.empresa.rfc)) {
      mensaje = 'Se necesita revisar el RFC.';
    }
    if (this.empresa.correoAdministrador !== undefined && !this.validarCorreo(this.empresa.correoAdministrador)) {
      mensaje = 'El correo electronico no es valido.';
    }
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: mensaje,
    });
  }



}
