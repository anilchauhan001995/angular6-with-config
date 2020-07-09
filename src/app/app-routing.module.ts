import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { StateViewComponent } from './components/state-view/state-view.component';

const routes: Routes = [{
  path: '',
  redirectTo: "home",
  pathMatch: 'full'
},{
  path: 'home',
  component: HomeComponent,
  pathMatch: 'full'
}, {
  path: 'state',
  component: StateViewComponent,
  pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const RoutingComponent = [HomeComponent, StateViewComponent];