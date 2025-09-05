import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'user-transfer',
    loadComponent: () =>
      import('./pages/user-transfer/user-transfer.component').then((m) => m.UserTransferComponent),
  },
  {
    path: 'connection-fail',
    loadComponent: () =>
      import('./pages/disconnected/disconnected.component').then((c) => c.DisconnectedComponent),
  },
  {
    path: 'schema-transfer',
    loadComponent: () =>
      import('./pages/schema-transfer/schema-transfer.component').then(
        (c) => c.SchemaTransferComponent,
      ),
  },
  { path: '', pathMatch: 'full', redirectTo: 'schema-transfer' },
  { path: '**', redirectTo: 'schema-transfe' },
];
