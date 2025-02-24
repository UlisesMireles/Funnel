import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AdministracionComponent } from './components/administracion/administracion.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { EmpresasComponent } from './components/empresas/empresas.component';
import { LicenciasComponent } from './components/licencias/licencias.component';
import { SectoresComponent } from './components/catalogos/sectores/sectores.component';
import { StatsComponent } from './components/stats/stats.component';
import { CambiarContrasenaComponent } from './components/cambiar-contrasena/cambiar-contrasena.component';
import { TwoFactorComponent } from './components/two-factor/two-factor.component';


const routes: Routes = [
  { path: '', component: LoginComponent, title: 'Login' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'empresas', component: EmpresasComponent, title: 'Empresas', canActivate: [AuthGuard]  },
  { path: 'licencias', component: LicenciasComponent, title: 'Licencias', canActivate: [AuthGuard]  },
  { path: 'sectores', component: SectoresComponent, title: 'Sectores', canActivate: [AuthGuard]  },
  { path: 'stats', component: StatsComponent, title: 'Stats', canActivate: [AuthGuard]  },
  { path: 'cambiar-contrasena', component: CambiarContrasenaComponent, title: 'Cambiar Contraseña', canActivate: [AuthGuard]  },
  { path: 'two-factor', component: TwoFactorComponent, title: 'Autenticación', canActivate: [AuthGuard]  },
  { path: 'recuperar-contrasena', component: ResetPasswordComponent, title: 'Recuperar contraseña' },
  { path: 'administracion', component: AdministracionComponent, title: 'Administración', canActivate: [AuthGuard]  },
  { path: '**', component: EmpresasComponent, title: 'Empresas', canActivate: [AuthGuard]  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
