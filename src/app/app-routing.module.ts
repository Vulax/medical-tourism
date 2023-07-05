import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './components/map/map.component';
import { DetailsComponent } from './components/details/details.component';
import { HomeComponent } from './components/home/home.component';
import { Details2Component } from './components/details2/details.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {path: 'map', component: MapComponent},
  { path: 'details/:id', component: Details2Component },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
