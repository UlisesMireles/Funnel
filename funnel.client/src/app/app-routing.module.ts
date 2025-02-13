import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AdministracionComponent } from './components/administracion/administracion.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { EmpresasComponent } from './components/empresas/empresas.component';
import { LicenciasComponent } from './components/licencias/licencias.component';
import { SectoresComponent } from './components/catalogos/sectores/sectores.component';


const routes: Routes = [
  { path: '', component: LoginComponent, title: 'Login' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'empresas', component: EmpresasComponent, title: 'Empresas', canActivate: [AuthGuard]  },
  { path: 'licencias', component: LicenciasComponent, title: 'Licencias', canActivate: [AuthGuard]  },
  { path: 'sectores', component: SectoresComponent, title: 'Sectores', canActivate: [AuthGuard]  },
  { path: 'recuperar-contrasena', component: ResetPasswordComponent, title: 'Recuperar contraseña' },
  { path: 'administracion', component: AdministracionComponent, title: 'Administración', canActivate: [AuthGuard]  },
  { path: '**', component: AdministracionComponent, title: 'Administración', canActivate: [AuthGuard]  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
