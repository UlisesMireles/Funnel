import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Empresa } from '../../../interfaces/sel_Empresa';
import { Licencia } from '../../../interfaces/Licencia';
import { EmpresasService } from '../../../services/empresas.service';
import { INSUPDEmpresa } from '../../../interfaces/ins-upd-empresa';


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
  @Input() empresa!: Empresa;
  request!: INSUPDEmpresa;

  empresaActiva: boolean = false;
  licenciasDropdown:Licencia[] = [];
  selectedLicencia: number | undefined;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();

  constructor(private empresasService: EmpresasService) { }

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
      next: (result: Licencia[]) => {
        this.licenciasDropdown = result;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
  guardarEmpresa() {
    if (!this.request) {
      this.request = {} as INSUPDEmpresa;
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
    console.log(this.request);
    this.empresasService.postINSUPDEmpresa(this.request).subscribe(
      {
        next: (result: any[]) => {
          console.log(result)
        },
        error: (error)=> {
          console.log(error);
        }
      }
    );
  }
  actualizaEmpresa() {
    if (!this.request) {
      this.request = {} as INSUPDEmpresa;
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
    console.log(this.request);
    this.empresasService.postINSUPDEmpresa(this.request).subscribe(
      {
        next: (result: any[]) => {
          console.log(result)
        },
        error: (error)=> {
          console.log(error);
        }
      }
    );
  }
  getIniciales(): string {
    const obtenerIniciales = (texto: string | undefined): string|undefined => {
      return texto!
        .trim() // Elimina espacios en blanco al inicio y final
        .split(/\s+/) // Divide el texto por espacios (maneja múltiples espacios)
        .map(palabra => palabra.charAt(0).toUpperCase()) // Obtiene la primera letra en mayúscula
        .join(''); // Une las iniciales en un solo string
    };
    const inicialesNombre = obtenerIniciales(this.empresa.nombre);
    const inicialesPaterno = obtenerIniciales(this.empresa.apellidoPaterno);
    const inicialesMaterno = obtenerIniciales(this.empresa.apellidoMaterno);
    return `${inicialesNombre}${inicialesPaterno}${inicialesMaterno}`;
  }
  onAliasChange(newValue: string) {
    this.empresa.usuarioAdministrador= "admin."+newValue
    // Aquí puedes agregar la lógica adicional que desees ejecutar
  }
}
