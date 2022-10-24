import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { ResultsComponent } from './results/results.component';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import {GooglePlaceModule} from "ngx-google-places-autocomplete";
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputSwitchModule} from 'primeng/inputswitch';
import {AccordionModule} from 'primeng/accordion';
import {InputTextModule} from 'primeng/inputtext';
import { DataService } from './data.service';
import { CardModule } from 'primeng/card';
import {TableModule} from 'primeng/table';
import {DialogModule} from 'primeng/dialog';
import {TooltipModule} from 'primeng/tooltip';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { DividerModule } from "primeng/divider";

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ResultsComponent,
    LoginSignupComponent,
    ForgotPasswordComponent
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
    InputNumberModule,
    InputSwitchModule,
    AccordionModule,
    InputTextModule,
    CardModule,
    TableModule,
    DialogModule,
    TooltipModule,
    DividerModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
