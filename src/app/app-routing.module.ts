import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MapComponent } from './components/map/map.component';
import { DetailsComponent } from './components/details/details.component';
import { BlogComponent } from './components/blog/blog.component';

const routes: Routes = [
  { path: '', component: MapComponent },
  { path: 'details/:id', component: DetailsComponent },
  { path: 'blog', component: BlogComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
