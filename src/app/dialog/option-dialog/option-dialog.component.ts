import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


export interface OptionDialogData {
  title: string;
  message: string;
  iconName?: string;
  showOkButton?: boolean;
  showCancelButton?: boolean;
  okButtonText?: string;
  cancelButtonText?: string;
}

@Component({
  selector: 'app-option-dialog',
  templateUrl: './option-dialog.component.html',
  styleUrls: ['./option-dialog.component.css']
})
export class OptionDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: OptionDialogData,
    private matDialog: MatDialogRef<OptionDialogComponent>,
  ) { }


  ngOnInit() {
  }

  onSubmit() {
    this.matDialog.close(true);
  }

  get okButtonText(): string {
    return this.data.okButtonText || 'common.button.yes';
  }

  get cancelButtonText(): string {
    return this.data.cancelButtonText || 'common.button.no';
  }

  get showOkButton(): boolean {
    return this.data.showOkButton === undefined ? true : this.data.showOkButton;
  }

  get showCancelButton(): boolean {
    return (this.data.showCancelButton !== null || this.data.showCancelButton !== undefined) ? this.data.showCancelButton : false;
  }

  get icon(): string {
    return this.data.iconName || 'warning';
  }
}
