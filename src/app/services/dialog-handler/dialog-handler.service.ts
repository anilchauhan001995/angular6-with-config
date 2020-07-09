import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { OptionDialogComponent, OptionDialogData } from 'src/app/dialog/option-dialog/option-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogHandler {

  private static instance: DialogHandler;
  private matDialog: MatDialog;
  private _showSpinner = new BehaviorSubject<boolean>(false);
  private _forceHideSpinnerSubject = new Subject<boolean>();

  private constructor() {}

  get onShowSpinner(): Observable<boolean> {
    return this._showSpinner;
  }

  get forceHideSpinnerSubject(): Subject<boolean> {
    return this._forceHideSpinnerSubject;
  }

  get isSpinnerVisible(): boolean {
    return this._showSpinner.getValue();
  }

  static getInstance() {
    if (!DialogHandler.instance) {
      DialogHandler.instance = new DialogHandler();
    }
    return DialogHandler.instance;
  }


  initialize(matDialog: MatDialog) {
    this.matDialog = matDialog;
  }

  /**
   * Not working as expected. not being used any where as of now
   * showDialog<T, R>(component: ComponentType<T>, data = {}): Observable<R> {
   * return this.matDialog.open(component, {data}).afterClosed();
   * }
   */


  showOptionDialog(title: string, message: string, okButtonText?: string, cancelButtonText?: string, showCancelButton = true)
    : Observable<boolean> {
    const data: OptionDialogData = {
      title,
      message,
      okButtonText,
      cancelButtonText,
      showCancelButton,
    };
    return this.matDialog.open(OptionDialogComponent, { data }).afterClosed();
  }

  showSpinner() {
    this._showSpinner.next(true);
  }

  hideSpinner() {
    this._showSpinner.next(false);
  }

  forceHideSpinner(): void {
    this.hideSpinner();
    this.forceHideSpinnerSubject.next(true);
  }
 
}
