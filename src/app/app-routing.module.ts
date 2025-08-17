// src/app/app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountryPageComponent } from './pages/country-page/country-page.component';

// Import the CountryPageComponent for the eager route

const routes: Routes = [
  {
    path: '',
    // This lazy-loads your MainPageModule for a fast initial load
    loadChildren: () => import('./pages/main.module').then(m => m.MainPageModule)
  },
  {
    path: 'country/:name',
    // This is a standard, eagerly-loaded route
    component: CountryPageComponent
  },
  {
    path: '**', // Wildcard route
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
