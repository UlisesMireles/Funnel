import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AdministracionComponent } from './components/administracion/administracion.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { EmpresasComponent } from './components/empresas/empresas.component';

const routes: Routes = [
  { path: '', component: LoginComponent, title: 'Login' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'recuperar-contrasena', component: ResetPasswordComponent, title: 'Recuperar contraseña' },
  { path: 'administracion', component: AdministracionComponent, title: 'Administración', canActivate: [AuthGuard]  },
  { path: '**', component: AdministracionComponent, title: 'Administración', canActivate: [AuthGuard]  },
  { path: 'empresas', component: EmpresasComponent, title: 'Empresas', canActivate: [AuthGuard]  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
