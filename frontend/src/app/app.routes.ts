import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'user-transfer',
    loadComponent: () =>
      import('./pages/user-transfer/user-transfer.component').then(m => m.UserTransferComponent)
  },
  {
    path:'schema-transfer',
    loadComponent:()=>
      import('./pages/schema-transfer/schema-transfer.component').then(c => c.SchemaTransferComponent)
  },
  { path: '', pathMatch: 'full', redirectTo: 'schema-transfe' },
  { path: '**', redirectTo: 'schema-transfe' }
];
