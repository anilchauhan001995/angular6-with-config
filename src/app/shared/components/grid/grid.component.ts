import { Component, OnInit, Input, SimpleChanges, ContentChildren, Output, ViewChild, DoCheck, OnChanges, AfterContentInit, EventEmitter } from '@angular/core';
import { AggregateDescriptor, State, process, AggregateResult, aggregateBy } from '@progress/kendo-data-query';
import { SelectableSettings, DataStateChangeEvent, SelectAllCheckboxState, ColumnComponent, RowArgs, GridDataResult, GridComponent } from '@progress/kendo-angular-grid';
import { ColumnSetting } from './column-setting';
import { FormBuilder } from '@angular/forms';

import * as _ from 'lodash';

const resolvedPromise = Promise.resolve(null);

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class MainGridComponent implements OnInit, DoCheck, AfterContentInit, OnChanges {

  @Input() data: any[];
  @Input() columns: ColumnSetting[];
  @Input() sortable = true;
  @Input() selectable: SelectableSettings | boolean = true;
  @Input() selectedKeys: any[] = [];
  @Input() pageable = true;
  @Input() viewRateDetails = false;
  @Input() scrollable;
  @Input() height;
  @Input() defaultSortBy: string;
  @Input() sortByDesc: boolean;
  @Input() showCheckBoxColumn = false;
  @Input() kendoGridSelectBy;
  @Input() rowClass: () => {};
  @Input() isCellEdited = false;
  @Input() showEditIconCell = false;
  @Input() aggregates: AggregateDescriptor[];
  @Input() groups = [];
  @Input() showColumnMenu = false;
  @Input() filterable = false;
  @Input() serverSideFilterPaginationEnabled = false;
  @Input() loading;
  @Input() viewState: State;
  @Input() summarySize: number = 80;
  
  @Output() onDoubleClick = new EventEmitter<any>();
  @Output() onCtrlDoubleClick = new EventEmitter<any>();
  @Output() onRowSelect = new EventEmitter<any>();
  @Output() onCellClose = new EventEmitter<any>(); // TODO how to use it and what is that ?
  @Output() onCellClick = new EventEmitter<any>(); // TODO how to use it and what is that ?
  @Output() onEditCellClick = new EventEmitter<any>();
  @Output() dataStateChanged = new EventEmitter<any>();
  @Output() selectedIconClicked = new EventEmitter<any[]>();
  @Output() selectedKeysChange = new EventEmitter<any[]>();

  @ContentChildren(ColumnComponent) customColumns;

  @ViewChild(GridComponent) grid: GridComponent;

  oldData: any[];
  rowIndex: number;
  mySelection: any[] = [1, 3];
  pageSize = 10;
  readonly PAGE_SIZES = [10, 25, 50, 100];
  selectAllState: SelectAllCheckboxState = 'unchecked';
  previouslySelected: any;
  _gridView: GridDataResult;
  _state: State;
  _tableHeight: number;
  pagerHeight = 60;

  constructor(private fb: FormBuilder) {
    this.viewState = {
      skip: 0,
      take: 10,
    };
  }

  get gridView(): GridDataResult {
    if (this._gridView) {
      const processedResult = process((this._gridView.data || []), { ...this.viewState, take: this._gridView.data.length, skip: 0 });

      return { data: processedResult.data, total: this._gridView.total };
    }
    return process((this.data || []), this.viewState);
  }

  @Input()
  set gridView(value: GridDataResult) {
    this._gridView = value;
    this.selectedKeys = [];
    this.selectAllState = 'unchecked';
  }

  getSummaryFieldClass(value: string = ''): string {
    return value.length > this.summarySize ? 'amw-k-tooltip' : '';
  }

  isMultiPage(): boolean {
    return !!(this.pageable && (this.gridView && this.gridView.total > this.pageSize));
  }

  get lodash(): any {
    return _;
  }

  get state(): State {
    return this._state || { skip: 0, take: this.pageSize };
  }

  set state(value: State) {
    this._state = {
      filter: value.filter || this.state.filter,
      sort: value.sort || this.state.sort,
      take: value.take != null && value.take >= 0 ? value.take : this.state.take,
      skip: value.skip != null && value.skip >= 0 ? value.skip : this.state.skip,
      group: value.group || this.groups,
    };
  }

  get total(): AggregateResult {
    return aggregateBy(process(this.data, { group: this.groups, sort: this.state.sort, filter: this.state.filter }).data, this.aggregates);
  }

  mySelectionKey(context: RowArgs): any {
    return context.dataItem;
  }

  getRowClass() {
    return this.rowClass || (() => {
    });
  }

  isRowSelected(e: RowArgs) {
    return this.mySelection.indexOf(e.dataItem.coupon) >= 0;
  }

  ngDoCheck(): void {
    // TODO implement proper method to compare two arrays
    if (this.data && (this.data !== this.oldData) && !this.isCellEdited) {
      this.oldData = this.data.slice();
    }
  }

  ngOnInit() {
    if (this.defaultSortBy) {
      this.initGrid();
    }
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['data']) {
      this.selectedKeys = [];
      this.selectAllState = 'unchecked';
    }

    if (!simpleChanges.aggregates) {
      this.resetState();
    }
  }

  resetState(): void {
    this.state = { ...this.state, skip: 0 };
  }

  resetViewState(): void {
    this.setState({ skip: 0, take: 10 });
  }

  ngAfterContentInit() {
    resolvedPromise.then(() => {
      const generatedColumns = this.grid.columns.toArray() as ColumnComponent[];
      const customColumns = this.customColumns.toArray();
      for (let i = 0; i < generatedColumns.length; i++) {
        if (generatedColumns[i].format === 'custom' && customColumns.length > 0) {
          generatedColumns[i].template = customColumns.shift().template;
        }
      }
      this.grid.columns.reset(generatedColumns);
    });
  }

  get selectableData(): any[] {
    return this.selectableColumn ? (_.get(this.gridView, 'data') || []).filter(item => _.get(item, this.selectableColumn.field)) : [];
  }

  get selectableColumn(): ColumnSetting {
    return this.columns.find(column => column.showCheckBox && column.iconTooltip && column.iconSelectAllTooltip && Boolean(column.dataKey));
  }

  get lodashLib(): any {
    return _;
  }

  dataStateChange(state: DataStateChangeEvent): void {
    this.setState(state);
    this.emitDataStateChangeEvent(state);
  }

  editCellClickHandler(event) {
    this.onEditCellClick.emit(event);
  }

  selectRow(payload) {
    this.onRowSelect.emit(payload);
  }

  doubleClick(e): MouseEvent {
    if (e.target.localName !== 'td') {
      return;
    }
    const rowIndex = this.rowIndex;
    const index = rowIndex && rowIndex % this.pageSize;
    const dataItem = this.gridView.data[index];
    if (e.ctrlKey && dataItem) {
      this.onCtrlDoubleClick.emit(dataItem);
      return;
    }
    this.onDoubleClick.emit(dataItem);
  }

  initGrid() {
    const tempState = this.getState();
    tempState.sort = [{ dir: this.sortByDesc ? 'desc' : 'asc', field: this.defaultSortBy }];
    this.setState(tempState);
  }

  getState(): State {
    return this.viewState;
  }

  cellClickHandler(event) {
    this.rowIndex = event.rowIndex;
    this.onCellClick.emit(event);
  }

  cellCloseHandler(event) {
    this.onCellClose.emit(event);
  }

  closeCell() {
    this.grid.closeCell();
  }

  onSelectedIconClicked(dataItem: any): void {
    if (dataItem) {
      this.selectedIconClicked.emit([dataItem]);
      this.selectableData.length = 0;
      return;
    }
    this.selectedIconClicked.emit(this.selectedKeys);
    this.selectableData.length = 0;
  }

  get isMultipleSelectable(): boolean {
    return _.get(this.selectable, 'mode', 'single') === 'multiple';
  }

  onSelectedKeysChange(e): void {
    if (this.selectedKeysChange) {
      this.selectedKeysChange.emit(e);
    }
    if (!this.selectableColumn) {
      return;
    }
    const len = this.selectedKeys.length;

    if (this.isMultipleSelectable) {
      const dataLen = this.selectableData.length;

      if (len === 0) {
        this.selectAllState = 'unchecked';
        this.previouslySelected = null;
      } else if (dataLen === len) {
        this.selectAllState = 'checked';
        this.previouslySelected = null;
      } else if (len > 0 && len < dataLen) {
        this.selectAllState = 'indeterminate';
      }
    } else {

      if (len === 0) {
        this.selectAllState = 'unchecked';
        this.previouslySelected = null;

      } else if (len === 1) {
        this.previouslySelected = this.selectedKeys[0];
        if (this.selectableData.length === len) {
          this.selectAllState = 'checked';
        } else if (this.selectableData.length - 1 === len && this.selectAllState === 'checked') {
          this.selectedKeys = [];
          this.selectAllState = 'unchecked';
        } else {
          this.selectAllState = 'indeterminate';
        }

      } else if (len === 2) {
        this.previouslySelected = this.selectedKeys[0];
        if (this.selectableData.length === len && this.selectAllState === 'checked') {
          return;
        } else if (this.selectableData.length - 1 === len && this.selectAllState === 'checked') {
          this.selectAllState = 'unchecked';
          this.selectedKeys = [];
        } else {
          this.selectAllState = 'indeterminate';
        }

        this.selectedKeys = this.selectedKeys.filter(val => !_.isEqual(val, this.previouslySelected));

      } else if (len > 0 && len < this.selectableData.length) {
        this.selectedKeys = [];
        this.selectAllState = 'unchecked';
      } else {
        this.selectAllState = 'checked';
        this.previouslySelected = this.selectedKeys[0];
      }
    }
  }

  onSelectAllChange(checkedState: SelectAllCheckboxState): void {
    if (!this.selectableColumn) {
      return;
    }
    if (checkedState === 'checked' && this.selectableData.length > 0) {
      this.selectedKeys = this.selectableData/*.map((item) => _.get(item, this.selectableColumn.dataKey))*/;
      this.selectAllState = 'checked';
      return;
    }
    this.selectedKeys = [];
    this.selectAllState = 'unchecked';
  }

  private setState(value: State) {
    this.viewState = {
      filter: value.filter || this.viewState.filter,
      sort: value.sort || this.viewState.sort,
      take: value.take != null && value.take >= 0 ? value.take : this.viewState.take,
      skip: value.skip != null && value.skip >= 0 ? value.skip : this.viewState.skip,
      group: value.group || this.viewState.group,
    };
  }

  onPageChange(state: DataStateChangeEvent): void {
    this.pageSize = state.take;
  }

  private emitDataStateChangeEvent(state?: DataStateChangeEvent): void {
    if (this.serverSideFilterPaginationEnabled) {
      this.dataStateChanged.emit(state ? state : this.viewState);
    }
  }

}
