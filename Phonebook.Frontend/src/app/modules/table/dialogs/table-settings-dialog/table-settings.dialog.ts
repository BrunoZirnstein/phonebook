import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { ColumnDefinitions } from 'src/app/shared/config/columnDefinitions';
import { ColumnTranslate } from 'src/app/shared/config/columnTranslate';
import { ColumnId } from 'src/app/shared/models/enumerables/ColumnId';
import { ResetTableSettings, SetVisibleTableColumns, TableState } from 'src/app/shared/states';

@Component({
  selector: 'app-table-settings-dialog',
  templateUrl: './table-settings.dialog.html',
  styleUrls: ['./table-settings.dialog.scss']
})
export class TableSettingsDialog implements OnInit {
  public notDisplayedColumns: ColumnId[] = [];
  public displayedColumns: ColumnId[] = this.store.selectSnapshot(TableState.visibleColumns);

  constructor(public store: Store, public columnTranslate: ColumnTranslate) {}

  public ngOnInit() {
    this.updateNotDisplayedColumns();
  }

  private updateNotDisplayedColumns() {
    this.notDisplayedColumns = ColumnDefinitions.getAll()
      .filter(col => {
        return !this.displayedColumns.some(columnId => {
          return col.id === columnId;
        });
      })
      .map(col => col.id);
  }

  public resetTableSettings() {
    this.store.dispatch(new ResetTableSettings());
    this.displayedColumns = this.store.selectSnapshot(TableState.visibleColumns);
    this.updateNotDisplayedColumns();
  }

  public drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
    this.store.dispatch(new SetVisibleTableColumns(this.displayedColumns));
  }
}
