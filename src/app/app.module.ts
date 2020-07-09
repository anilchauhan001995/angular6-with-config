import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule, RoutingComponent } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {ToasterModule} from 'angular2-toaster'
import { TranslateModule } from '@ngx-translate/core'
import { StateViewComponent } from './components/state-view/state-view.component';
import { OptionDialogComponent } from './dialog/option-dialog/option-dialog.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { MainGridComponent } from './shared/components/grid/grid.component';


@NgModule({
  declarations: [
    AppComponent, HomeComponent, HeaderComponent, StateViewComponent, RoutingComponent, OptionDialogComponent, MainGridComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    SharedModule,
    BrowserAnimationsModule,
    HttpClientModule,
    GridModule,
    MatDialogModule,
    MatIconModule,
    ToasterModule.forRoot(),
    TranslateModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
],
})
export class AppModule { }
