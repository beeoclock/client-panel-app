import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  // {
  //   path: 'company',
  //   loadChildren: () => import('./pages/company/company.module').then(m => m.CompanyPageModule)
  // },
  // {
  //   path: 'panel',
  //   children: [
  //     {
  //       path: 'specialist',
  //       loadChildren: () => import('./pages/panels/specialist/specialist.module').then(m => m.SpecialistPageModule)
  //     },
  //     {
  //       path: '**',
  //       redirectTo: '/',
  //     },
  //   ]
  // },
  // {
  //   path: 'authorization',
  //   canActivate: [AuthorizationGuard],
  //   loadChildren: () => import('./pages/authorization/authorization.module').then(m => m.AuthorizationPageModule)
  // },
  // // Redirect
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   redirectTo: 'biz'
  // },
  // {
  //   path: '',
  //   loadChildren: () => import('./pages/not-found/not-found.module').then(m => m.NotFoundPageModule)
  // },
  // {
  //   path: '**',
  //   redirectTo: '/',
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
