// src/app/pages/main/main.module.ts

import { NgModule } from '@angular/core';
import { MainRoutingModule } from './main-routing.module';
import { SharedModule } from '../shared/shared-module';
import { MainPageComponent } from './main-page/main-page.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePageComponent } from './home-page/home-page.component';
import { CountryPageComponent } from './country-page/country-page.component';


@NgModule({
  declarations: [
    MainPageComponent,
    HomePageComponent,
    CountryPageComponent

  ],
  imports: [
    SharedModule, // Import SharedModule to use Header, Footer, etc.
    MainRoutingModule,
    FormsModule
  ]
})
export class MainPageModule { }
