import { Component, EventEmitter, Input, Output, ViewChild,  ElementRef, ChangeDetectorRef  } from '@angular/core';

/*Primeng*/
import { MessageService } from 'primeng/api';

/*Services*/
import { EmpresasService } from '../../../services/empresas.service';

/*Intefaces*/
import { requestEmpresa } from '../../../interfaces/Empresa';
import { baseOut } from '../../../interfaces/utils/baseOut'
import { dataEmpresa } from '../../../interfaces/Empresa';
import { dropdownLicencia } from '../../../interfaces/Licencia';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../enviroment/enviroment';

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
  selectedFile: File | null = null;
  selectedFileName: string = '';
  formModificado: boolean = false;
  selectedFileOriginal: File | null = null;

  imagePreview: string | ArrayBuffer | null = null;
  baseUrl: string = environment.baseURL;
  rutaImgen: string = this.baseUrl + 'LogosEmpresas/';
  rutaImgenDefault: string = this.baseUrl + 'LogosEmpresas/logotipo-glupoint.png';

  formEmpresas!: FormGroup;
  userId: number = 0; 

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Output() result: EventEmitter<baseOut> = new EventEmitter();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private empresasService: EmpresasService, private messageService: MessageService, private fb: FormBuilder,
    private cd: ChangeDetectorRef) { 
    this.userId = parseInt(localStorage.getItem('currentUser')!);
    this.formEmpresas = this.fb.group({
      idEmpresa: [0],
      bandera: ['INS-EMPRESA'],
      nombreEmpresa : ['', Validators.required],
      idAdministrador: [0],
      idLicencia: [0, Validators.required],
      alias: ['', Validators.required],
      rfc: ['', Validators.required],
      vInicio: ['', Validators.required],
      vTerminacion: ['', Validators.required],
      usuarioCreador: [this.userId],
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: [''],
      iniciales: [''],
      correo: ['', Validators.required],
      usuario:[''],
      urlSitio:['www.'],
      activo: [1],
      permitirDecimales: [false]
    });    
  }

  ngOnInit(): void {
    this.formEmpresas.get('rfc')?.valueChanges.subscribe(value => {
      if (value) {
        this.formEmpresas.get('rfc')?.setValue(value.toUpperCase(), {emitEvent: false});
      }
    });    
  }

  onDialogShow() {
    this.getLicencias();    
    this.selectedLicencia = this.empresa.idLicencia;
    this.empresaActiva = this.empresa?.activo === 1;
    const permitirDecimalesActivo = Boolean(this.empresa?.permitirDecimales); 
    this.empresa.vInicio = new Date(this.empresa.vInicio);
    this.empresa.vTerminacion = new Date(this.empresa.vTerminacion);

    if (!this.insertar) {
      this.formEmpresas = this.fb.group({ 
        idEmpresa: [this.empresa.idEmpresa],
        bandera: ['UPD-EMPRESA'],
        nombreEmpresa : [this.empresa.nombreEmpresa, Validators.required],
        idAdministrador: [this.empresa.idAdministrador],
        idLicencia: [this.empresa.idLicencia, Validators.required],
        alias: [this.empresa.alias, Validators.required],
        rfc: [this.empresa.rfc, Validators.required],
        vInicio: [this.empresa.vInicio, Validators.required],
        vTerminacion: [this.empresa.vTerminacion, Validators.required],
        usuarioCreador: [this.userId],
        nombre: [this.empresa.nombre, Validators.required],
        apellidoPaterno: [this.empresa.apellidoPaterno, Validators.required],
        apellidoMaterno: [this.empresa.apellidoMaterno],
        iniciales: [this.getIniciales()],
        correo: [this.empresa.correoAdministrador, Validators.required],
        usuario:[this.empresa.usuarioAdministrador],
        urlSitio:[this.empresa.urlSitio],
        selectedFile: [this.selectedFile],
        activo: [this.empresaActiva],
        permitirDecimales: permitirDecimalesActivo
      }); 
      if (this.empresa.archivoImagen) {
        this.selectedFile = { name: this.empresa.archivoImagen } as File;
        this.selectedFileName = this.empresa.archivoImagen;
        //this.imagePreview = this.baseUrl + 'LogosEmpresas/' + this.empresa.archivoImagen;

        this.imagePreview = `${this.baseUrl}LogosEmpresas/${this.empresa.archivoImagen}?t=${Date.now()}`;
        this.cd.detectChanges();
      } else {
        this.imagePreview = null;
      }
    } else {
      this.formEmpresas = this.fb.group({
        idEmpresa: [0],
        bandera: ['INS-EMPRESA'],
        nombreEmpresa : ['', Validators.required],
        idAdministrador: [0],
        idLicencia: [0, Validators.required],
        alias: ['', Validators.required],
        rfc: ['', Validators.required],
        vInicio: ['', Validators.required],
        vTerminacion: ['', Validators.required],
        usuarioCreador: [this.userId],
        nombre: ['', Validators.required],
        apellidoPaterno: ['', Validators.required],
        apellidoMaterno: [''],
        iniciales: [''],
        correo: ['', Validators.required],
        usuario:[''],
        urlSitio:['www.'],
        selectedFile: [this.selectedFile],
        activo: [1],
        permitirDecimales: [false]
      });
      this.imagePreview = null;
      this.selectedFileName = '';
    }
    this.formEmpresas.controls['usuario'].disable();
    
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
  if (this.formEmpresas.invalid) {
    Object.keys(this.formEmpresas.controls).forEach(key => {
      const control = this.formEmpresas.get(key);
      control?.markAsTouched();
    });
    return;
  }
  if (this.camposInvalidosInsertar()) {
    this.mostrarToastError();
    return;
  }

  this.formEmpresas.controls['iniciales'].setValue(this.getIniciales());
  this.formEmpresas.controls['activo'].setValue(1);

  const formValue = this.formEmpresas.getRawValue();
  const formData = new FormData();

  for (const key in formValue) {
    if (key === 'selectedFile') continue; 
    const value = formValue[key];
    if (value !== null && value !== undefined) {
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else {
        formData.append(key, value.toString());
      }
    }
  }
  formData.append('permitirDecimales', formValue.permitirDecimales.toString());

  if (this.selectedFile instanceof File) {
    formData.append('imagen', this.selectedFile, this.selectedFile.name);
  }
  this.empresasService.postINSUPDEmpresa(formData).subscribe({
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
  });
}
  actualizaEmpresa() {
  if (this.formEmpresas.invalid) {
    Object.keys(this.formEmpresas.controls).forEach(key => {
      const control = this.formEmpresas.get(key);
      control?.markAsTouched();
    });
    return;
  }

  if (this.camposInvalidosEditar()) {
    this.mostrarToastError();
        console.log(this.formEmpresas);
    return;

  }

  this.formEmpresas.controls['bandera'].setValue('UPD-EMPRESA');
  this.formEmpresas.controls['iniciales'].setValue(this.getIniciales());
  
  const formValue = this.formEmpresas.getRawValue();
  formValue.activo = this.formEmpresas.controls['activo'].value ? 1 : 0;

  const formData = new FormData();
  for (const key in formValue) {
    if (key === 'selectedFile') continue;
    const value = formValue[key];
    if (value !== null && value !== undefined) {
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else {
        formData.append(key, value.toString());
      }
    }

    
  }
  formData.append('permitirDecimales', formValue.permitirDecimales.toString());
  let nombreArchivo = '';
      if (this.selectedFile ) {
      const extension = this.selectedFile.name.split('.').pop();

      const alias = formValue.alias || '';
      const id = formValue.idEmpresa || '';

      nombreArchivo = `${alias}_${id}`;


      nombreArchivo = `${nombreArchivo}.${extension}`;


        // Agrega la imagen con el nuevo nombre
        formData.append('archivoImagen', nombreArchivo);
      }
    

    if (this.selectedFile instanceof File) {
      formData.append('imagen', this.selectedFile, this.selectedFile.name);
    }

  this.empresasService.postINSUPDEmpresa(formData).subscribe({
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
  });
}
  getIniciales(): string {
    const obtenerIniciales = (texto: string | undefined): string|undefined => {
      return texto!
        .trim()
        .split(/\s+/)
        .map(palabra => palabra.charAt(0).toUpperCase())
        .join('');
    };
    const inicialesNombre = obtenerIniciales(this.formEmpresas.controls['nombre'].value);
    const inicialesPaterno = obtenerIniciales(this.formEmpresas.controls['apellidoPaterno'].value);
    let inicialesMaterno = '';
    if (this.formEmpresas.controls['apellidoMaterno'].value){
      inicialesMaterno = obtenerIniciales(this.formEmpresas.controls['apellidoMaterno'].value)!;
    }
      
    return `${inicialesNombre}${inicialesPaterno}${inicialesMaterno}`;
  }
  onAliasChange(event:any) {
    const newValue = event.target.value;
    this.formEmpresas.controls['usuario'].setValue("admin." + newValue);
  }
  esCampoInvalido(campo: string): boolean {
    const control = this.formEmpresas.get(campo);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }

  onRFCChange(event:any) {
    const value = event.target.value;
    this.formEmpresas.get('rfc')?.setValue(value.toUpperCase());
  }
  camposInvalidosInsertar(): boolean {
    return (
      !this.validarFechas()||
      this.validarNombreEmpresa()||
      !this.validarRFC(this.formEmpresas.get('rfc')?.value)||
      !this.validarCorreo(this.formEmpresas.get('correo')?.value) ||
      this.validarAlias() 
    );
  }
  camposInvalidosEditar(): boolean {
    return (
      !this.validarFechas()||
      !this.validarRFC(this.formEmpresas.get('rfc')?.value)||
      !this.validarCorreo(this.formEmpresas.get('correo')?.value) 
      
    );
  }

  /**
   * Método para validar que vInicio sea menor a vTerminacion.
   */
  validarFechas(): boolean {
    if (!this.formEmpresas.controls['vInicio'].value || !this.formEmpresas.controls['vTerminacion'].value) {
      return true; // No validar si las fechas están vacías
    }
    return new Date(this.formEmpresas.controls['vInicio'].value) < new Date(this.formEmpresas.controls['vTerminacion'].value);
  }
  validarNombreEmpresa(): boolean {
    const nombre = this.formEmpresas.get('nombreEmpresa')?.value;
    return this.empresas.some((empresa) => empresa.nombreEmpresa?.toLowerCase().trim()=== nombre.toLowerCase().trim());
  }

  validarAlias(): boolean {
    const alias = this.formEmpresas.get('alias')?.value;
    return this.empresas.some((empresa) => empresa.alias?.toLowerCase().trim() === alias.toLowerCase().trim());
  }
  validarRFC(rfc: string): boolean {
    const regexRFC = /^([A-ZÑ&]{3,4})\d{6}([A-Z\d]{3})?$/;
    return regexRFC.test(rfc);
  }
  validarCorreo(correo: string): boolean {
    // Expresión regular para validar un correo electrónico
    const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regexCorreo.test(correo);
  }

  validarUrl(url: string): boolean {
    const regexCorreo = /^www\.([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return regexCorreo.test(url);
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
    if (this.validarNombreEmpresa() && this.insertar) {
      mensaje = 'El nombre de la empresa ya existe.';
    }
    if (this.validarAlias() && this.insertar) {
      mensaje = 'El alias de la empresa ya existe.';
    }
    if (!this.validarRFC(this.formEmpresas.get('rfc')?.value)) {
      mensaje = 'Se necesita revisar el RFC.';
    }
    if (!this.validarCorreo(this.formEmpresas.get('correo')?.value)) {
      mensaje = 'Se necesita revisar el RFC.';
    }
    if (!this.validarUrl(this.formEmpresas.get('urlSitio')?.value)) {
      mensaje = 'Se necesita revisar la URL.';
    }
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: mensaje,
    });
  }

    removerFoto() {
    this.selectedFile = null;
    this.selectedFileName = '';
    this.imagePreview = null;
    this.formModificado = true;
    
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

    onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
      this.formModificado = true;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
        this.cd.detectChanges();
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  abrirInput(): void {
    this.fileInput.nativeElement.click();
  }

}
