import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { CountryPageComponent } from './country-page/country-page.component';
import {MainPageComponent} from "./main-page/main-page.component";

const routes: Routes = [
  { path: '', component: MainPageComponent }, // Default route (home page)
  { path: 'country/:name', component: CountryPageComponent }, // Route for country page with parameter
  { path: '**', redirectTo: '' } // Wildcard route to redirect unknown paths to home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
