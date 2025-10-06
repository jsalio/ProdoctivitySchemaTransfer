// import { ConnectionProfile } from './ConnectionProfile';
import { Profiles } from './Profiles';
import { RecordRow } from './RecordRow';
import { TransferProfile } from './TransferProfile';

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

export const TransferConnectionProfiles: RecordRow<TransferProfile>[] = [
  { field: 'default', label: '' },
  { field: 'name', label: 'Name' },
  { field: 'source', label: 'Origen' },
  { field: 'target', label: 'Objetivo' },
  { field: 'serverSource', label: 'Servidor' },
  { field: 'serverTarget', label: 'Servidor' },
];

// export interface TranferProfiles {
//   default: boolean;
//   name: string;
//   source: ConnectionProfile;
//   target: ConnectionProfile;
// }
