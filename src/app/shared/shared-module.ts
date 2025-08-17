// src/app/shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';
import { WorldMapComponent } from '../components/world-map/world-map.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    WorldMapComponent,
    SafeHtmlPipe
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    WorldMapComponent,
    SafeHtmlPipe,
    CommonModule,
    FormsModule
  ]
})
export class SharedModule { }
