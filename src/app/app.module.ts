import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { WorldMapComponent } from './components/world-map/world-map.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { StatsComponent } from './stats/stats.component';
import { TestimonialComponent } from './testimonial/testimonial.component';
import { CountryPageComponent } from './country-page/country-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    WorldMapComponent,
    SafeHtmlPipe,
    FooterComponent,
    HeaderComponent,
    StatsComponent,
    TestimonialComponent,
    CountryPageComponent,
    MainPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
