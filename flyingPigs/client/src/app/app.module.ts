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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DividerModule } from "primeng/divider";
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { ScrollToTopComponent } from './scroll-to-top/scroll-to-top.component';
import { ScrollTopModule } from 'primeng/scrolltop';
import {ToastModule} from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule } from 'primeng/toolbar';
import {TreeSelectModule} from 'primeng/treeselect';
import { SliderModule } from 'primeng/slider';
import {RadioButtonModule} from 'primeng/radiobutton';
import {MultiSelectModule} from 'primeng/multiselect';


@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ResultsComponent,
    LoginSignupComponent,
    ForgotPasswordComponent,
    ScrollToTopComponent
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
    DividerModule,
    ScrollTopModule,
    ToastModule,
    PanelModule,
    ToolbarModule,
    TreeSelectModule,
    SliderModule,
    RadioButtonModule,
    MultiSelectModule,
    LoggerModule.forRoot({
      serverLoggingUrl: 'http://localhost:5200/airports/log',
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.ERROR,
      disableConsoleLogging: false
    })
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
