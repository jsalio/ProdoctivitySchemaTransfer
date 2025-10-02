import { CommonModule } from '@angular/common';
import {
  Component,
  signal,
  computed,
  ChangeDetectionStrategy,
  input,
  ContentChild,
  TemplateRef,
  Signal,
  effect,
} from '@angular/core';

export interface RecordRow<T> {
  field: keyof T;
  label: string;
  sortingBy?: keyof T | null;
  asc?: boolean;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent<T extends object> {
  dataSet = input<Signal<T[]> | T[]>([]);
  columns = input<RecordRow<T>[]>([]);

  private dataSignal = signal<T[]>([]);
  filter = signal<string>('');
  sort = signal<{ col: keyof T | null; asc: boolean }>({ col: null, asc: true });

  @ContentChild(TemplateRef) actionTemplate?: TemplateRef<unknown>;

  constructor() {
    // Usamos un effect para sincronizar dataSignal con dataSet
    effect(
      () => {
        const data = this.dataSet();
        if (typeof data === 'function') {
          this.dataSignal.set(data());
        } else {
          this.dataSignal.set(data);
        }
      },
      { allowSignalWrites: true },
    );
  }

  filteredRows = computed(() => {
    const q = this.filter().trim().toLowerCase();
    let rows = this.dataSignal();

    if (q) {
      rows = rows.filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(q)));
    }

    const s = this.sort();
    if (s.col) {
      const col = s.col;
      rows = [...rows].sort((a, b) => {
        const aVal = String(a[col] ?? '').toLowerCase();
        const bVal = String(b[col] ?? '').toLowerCase();
        if (aVal < bVal) return s.asc ? -1 : 1;
        if (aVal > bVal) return s.asc ? 1 : -1;
        return 0;
      });
    }

    return rows;
  });

  setSort(col: keyof T) {
    const current = this.sort();
    if (current.col === col) {
      this.sort.set({ col, asc: !current.asc });
    } else {
      this.sort.set({ col, asc: true });
    }
  }

  checkField = (rowFieldValue: unknown): unknown => {
    if (typeof rowFieldValue === 'boolean') {
      if (rowFieldValue as boolean) {
        return '✓';
      }
      return '';
    }
    return rowFieldValue;
  };
}
