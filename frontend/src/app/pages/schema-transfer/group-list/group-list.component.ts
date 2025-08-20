import { Component, OnInit, computed, output, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Credentials } from '../../../types/models/Credentials';
import { DocumentGroup } from '../../../types/contracts/ISchema';
import { LocalDataService } from '../../../services/ui/local-data.service';
import { SchemaService } from '../../../services/backend/schema.service';

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.css'
})
export class GroupListComponent implements OnInit {
  documentGroups = signal<Array<DocumentGroup>>([])
  loading = signal<boolean>(true)
  selectedItem = signal<DocumentGroup | null>(null);
  selectedDocumetGroup = output<DocumentGroup | null>()

  constructor(private readonly localData: LocalDataService, private readonly schemaService: SchemaService) {

  }

  ngOnInit(): void {
    const credentialOfcloud = this.localData.getValue<Credentials>("Credentials_V6_Cloud");
    if (credentialOfcloud) {
      this.schemaService.getDocumentGruops(credentialOfcloud).subscribe((groupsData) => {
        console.log(groupsData)
        this.documentGroups.set(groupsData.data)
      })
    }
    const credentialsOfFluency =  this.localData.getValue<Credentials>("Credentials_V5_V5");
    if (credentialsOfFluency) {
      this.schemaService.getDocumentGruops(credentialsOfFluency).subscribe((groupsData) => {
        console.log(groupsData)
        // this.documentGroups.set(groupsData.data)
      })
    }
  }

  // Computed signal que reactivamente calcula las clases para cada item
  itemClasses = computed(() => {
    const selected = this.selectedItem();
    const baseClass = "p-2 rounded cursor-pointer hover:bg-blue-100";
    const selectedClass = "p-2 bg-gray-100 rounded cursor-pointer hover:bg-blue-100";

    // Retorna un Map para lookup eficiente
    const classMap = new Map<string, string>();

    this.documentGroups().forEach(item => {
      const isSelected = selected && item.groupName === selected.groupName;
      classMap.set(item.groupName, isSelected ? selectedClass : baseClass);
    });

    return classMap;
  });

  markItemAsSelected = (groupId: string) => {
    const selected = this.documentGroups().find(x => x.groupId === groupId);
    if (selected) {
      this.selectedItem.set(selected);
      this.selectedDocumetGroup.emit(selected)
    }
  }

  // Método helper para obtener la clase (opcional)
  getItemClass = (groupName: string): string => {
    return this.itemClasses().get(groupName) || "p-2 rounded cursor-pointer hover:bg-blue-100";
  }
}
