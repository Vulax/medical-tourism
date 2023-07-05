import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MapComponent } from "./components/map/map.component";
import { DetailsComponent } from "./components/details/details.component";
import { HomeComponent } from "./components/home/home.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { RegisterComponent } from "./components/register/register.component";
import { Details2Component } from "./components/details2/details.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "register", component: RegisterComponent },
  { path: "details/:id", component: Details2Component },
  { path: "profile", component: ProfileComponent },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
