import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { FooterComponent } from './components/footer/footer.component';

import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AdministracionComponent } from './components/administracion/administracion.component';
import { MenuComponent } from './components/menu/menu.component';

export function getBaseUrl() {
  return 'https://localhost:47440/'
}

import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectButtonModule } from 'primeng/selectbutton';
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
    ModalEmpresasComponent,
    LoginComponent,
    ResetPasswordComponent,
    FooterComponent,
    AdministracionComponent,
    MenuComponent
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
    ToastModule,
    ReactiveFormsModule,
    MenubarModule,
    ButtonModule,
    OverlayPanelModule
  ],
  providers: [
    { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] },
    provideAnimationsAsync(),
    providePrimeNG({
    theme: {
    preset: Aura
      }
    }),
    EmpresasService,
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
