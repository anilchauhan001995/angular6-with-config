import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import {MatButtonModule} from '@angular/material/button'
import { MatCommonModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatTableModule} from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainGridComponent } from './components/grid/grid.component';


@NgModule({
    imports: [
            FormsModule,
            ReactiveFormsModule,
            MatButtonModule,
             MatCommonModule,
             MatAutocompleteModule,
             MatTableModule,
             MatTableModule,
             MatTooltipModule,
             MatCheckboxModule,
             MatToolbarModule,
             MatRadioModule,
             MatPaginatorModule],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCommonModule,
        MatAutocompleteModule,
        MatTableModule,
        MatTableModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatToolbarModule,
        MatRadioModule,
        MatPaginatorModule],
    declarations: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}