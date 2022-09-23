import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { ResultsComponent } from './results/results.component';
import { ReactiveFormsModule } from '@angular/forms';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import {GooglePlaceModule} from "ngx-google-places-autocomplete";
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {InputNumberModule} from 'primeng/inputnumber';



@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ResultsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
      HttpClientModule,
      ReactiveFormsModule,
      BrowserAnimationsModule,
      ButtonModule,
      DropdownModule,
      FormsModule,
      GooglePlaceModule,
      OverlayPanelModule,
      InputNumberModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
