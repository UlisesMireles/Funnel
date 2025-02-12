import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { Tag } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { EmpresasComponent } from './components/empresas/empresas.component';

import { EmpresasService } from './services/empresas.service';
import { ModalEmpresasComponent } from './components/empresas/modal-empresas/modal-empresas.component';

@NgModule({
  declarations: [
    AppComponent,
    EmpresasComponent,
    ModalEmpresasComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,
    AppRoutingModule,
    TableModule,
    InputTextModule,
    TagModule,
    MultiSelectModule,
    SelectButtonModule,
    ButtonModule,
    InputIcon,
    IconField,
    Tag,
    DropdownModule,
    FormsModule,
    DialogModule,
    SelectModule,
    DatePickerModule,
    CheckboxModule,
    ToastModule
  ],
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
    theme: {
    preset: Aura
      }
    }),
    EmpresasService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
