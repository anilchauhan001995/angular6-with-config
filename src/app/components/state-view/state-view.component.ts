import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { StateDaoService } from 'src/app/dao/state-dao.service';
import { IStateResponse, IState } from 'src/app/model/state.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ColumnSetting } from 'src/app/shared/components/grid/column-setting';
import { State } from '@progress/kendo-data-query';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-state-view',
  templateUrl: './state-view.component.html',
  styleUrls: ['./state-view.component.css']
})
export class StateViewComponent implements OnInit, AfterViewInit {

  data: IState[] = [];
  stateView: StateDaoService;
  state: State = { skip: 0, take: 10, sort: [{ field: 'id', dir: 'desc' }] };
  displayedColumnsSetting: ColumnSetting[] = [
    {
      field: 'id',
      title: 'Id',
      type: 'text',
      width: '100'
    },
    {
      field: 'stateName',
      title: 'State Name',
      type: 'text',
      width: '100'
    },
    {
      field: 'modifiedBy',
      title: 'Modified By',
      type: 'text',
      width: '100'
    },
    {
      field: 'createdBy',
      title: 'Created By',
      type: 'text',
      width: '100'
    },
    {
      field: 'active',
      title: 'Active',
      type: 'text',
      width: '100'
    }];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private stateDao: StateDaoService, private notificationService: NotificationService) { }

  ngOnInit() {
    this.stateView = this.stateDao;
    this.state = { skip: 0, take: 10, sort: [{ field: 'id', dir: 'desc' }] };
    this.stateDao.query(this.state, this.onShowSuccess.bind(this));
  }

  onShowSuccess(data) {
    console.log(data);
  }

  ngAfterViewInit() {
  }

  onDataStateChanged(state: DataStateChangeEvent): void {
    if ((state.take !== this.state.take || state.skip !== this.state.skip || state.sort !== this.state.sort)) {
      this.stateDao.query(
        state,
        null,
        null,
        null);
    }
    this.state = state;
  }

}
