import { Profiles } from './Profiles';
import { RecordRow } from './RecordRow';

/**
 * Column configuration for the Profiles data table.
 * Used by the UI to render headers and bind fields of `Profiles` rows.
 */
export const ProfileTableCols: RecordRow<Profiles>[] = [
  { field: 'default', label: '' },
  { field: 'store', label: 'Sistema' },
  { field: 'accountName', label: 'usuario' },
  { field: 'organization', label: 'Organizacion' },
  { field: 'server', label: 'Servidor' },
];
