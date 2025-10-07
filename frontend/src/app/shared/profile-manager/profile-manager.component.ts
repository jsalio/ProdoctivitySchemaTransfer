import { Component, inject, WritableSignal } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { DataTableComponent } from '../data-table/data-table.component';
import { ProfileTableCols } from '../../types/models/constants';
import { Profiles } from '../../types/models/Profiles';
import { ConnectionProfile } from '../../types/models/ConnectionProfile';
import { ProfileManagerService } from './service/profile-manager.service';

@Component({
  selector: 'app-profile-manager',
  standalone: true,
  imports: [ButtonComponent, DataTableComponent],
  templateUrl: './profile-manager.component.html',
  styleUrl: './profile-manager.component.css',
})
export class ProfileManagerComponent {
  private service = inject(ProfileManagerService);

  profiles: WritableSignal<ConnectionProfile[]>;
  // Reuse the service computed to avoid duplicating mapping logic
  rows: () => Profiles[];

  cols = ProfileTableCols;

  /**
   *
   */
  constructor() {
    this.profiles = this.service.profiles;
    this.rows = this.service.rows;
  }

  removeRecord = (name: string) => {
    this.service.removeProfile(name);
  };

  setAsDefault = (name: string) => {
    this.service.setAsDefault(name);
  };
}
