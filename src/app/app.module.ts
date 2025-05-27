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

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    WorldMapComponent,
    SafeHtmlPipe,
    FooterComponent,
    HeaderComponent,
    StatsComponent,
    TestimonialComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
