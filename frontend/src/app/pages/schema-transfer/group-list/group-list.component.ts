import { Component, OnInit, computed, inject, output, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Credentials } from '../../../types/models/Credentials';
import { DocumentGroup } from '../../../types/contracts/ISchema';
import { ObservableHandler } from '../../../shared/utils/Obserbable-handler';
import { SchemaService } from '../../../services/backend/schema.service';
import { SchemaDocumentGroup } from '../../../types/models/SchemaDocumentGroup';
import { Filter } from '../utils/FilterDatalist';
import { FormsModule } from '@angular/forms';
import { FilterInputComponent } from '../../../shared/filter-input/filter-input.component';
import { FilterAnimation } from '../../../shared/Animation/filter';
import { MemStoreService } from '../../../services/ui/mem-store.service';

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterInputComponent],
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.css',
  animations: [FilterAnimation],
})
export class GroupListComponent implements OnInit {
  private readonly localData = inject(MemStoreService);
  private readonly schemaService = inject(SchemaService);

  sourceDocumentGroups = signal<DocumentGroup[]>([]);
  targetDocumentGroups = signal<DocumentGroup[]>([]);

  SchemaDocumentGroups = computed(() => {
    const findInTarget = (name: string): string | null => {
      const item = this.targetDocumentGroups().find((x) => x.groupName === name);
      if (!item) {
        return null;
      }
      return item.groupId;
    };

    const dataSet = this.sourceDocumentGroups().map(
      (x) =>
        ({
          documentTypesCounter: x.documentTypesCounter,
          groupId: x.groupId,
          groupName: x.groupName,
          targetId: findInTarget(x.groupName),
        }) as SchemaDocumentGroup,
    );

    if (this.filter() !== '') {
      return Filter(this.filter(), 'groupName', dataSet);
    }

    return dataSet;
  });

  loading = signal<boolean>(true);
  selectedItem = signal<SchemaDocumentGroup | null>(null);
  filter = signal<string>('');
  selectedDocumetGroup = output<SchemaDocumentGroup | null>();

  ngOnInit(): void {
    const credentialOfcloud = this.localData.getValue<Credentials>('Credentials_V6_Cloud');
    if (credentialOfcloud) {
      this.executeCall(credentialOfcloud, (response) => {
        this.sourceDocumentGroups.set(response.data);
      });
    }
    const credentialsOfFluency = this.localData.getValue<Credentials>('Credentials_V5_V5');
    if (credentialsOfFluency) {
      this.executeCall(credentialsOfFluency, (response) => {
        this.targetDocumentGroups.set(response.data);
      });
    }
  }

  executeCall = (
    credentials: Credentials,
    callback: (response: { data: DocumentGroup[]; success: boolean }) => void,
  ) => {
    ObservableHandler.handle(this.schemaService.getDocumentGruops(credentials))
      .onNext(callback)
      .onStart(() => this.loading.set(true))
      .onError((errr) => {
        console.warn(errr);
      })
      .onFinalize(() => this.loading.set(false))
      .execute();
  };

  // Computed signal que reactivamente calcula las clases para cada item
  itemClasses = computed(() => {
    const selected = this.selectedItem();
    const baseClass = 'flex items-center p-2 lg:p-3 hover:bg-gray-50 transition-colors';
    const selectedClass =
      'flex items-center p-2 lg:p-3 rounded-lg bg-blue-50 border border-blue-200 ';

    // Retorna un Map para lookup eficiente
    const classMap = new Map<string, string>();

    this.sourceDocumentGroups().forEach((item) => {
      const isSelected = selected && item.groupName === selected.groupName;
      classMap.set(item.groupName, isSelected ? selectedClass : baseClass);
    });

    return classMap;
  });

  markItemAsSelected = (groupId: string) => {
    const selected = this.SchemaDocumentGroups().find((x) => x.groupId === groupId);
    if (selected) {
      this.selectedItem.set(selected);
      this.selectedDocumetGroup.emit(selected);
    }
  };

  // Método helper para obtener la clase (opcional)
  getItemClass = (groupName: string): string => {
    return (
      this.itemClasses().get(groupName) ||
      'flex items-center p-2 lg:p-3 hover:bg-gray-50 transition-colors'
    );
  };

  onFilter = (value: string) => {
    this.filter.set(value);
  };
}
