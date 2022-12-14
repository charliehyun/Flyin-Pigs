import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRoute, ParamMap } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { ResultsComponent } from './results/results.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { FAQComponent } from './faq/faq.component';
import { FeedbackComponent } from './feedback/feedback.component';
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import { TrackedTripsComponent } from './tracked-trips/tracked-trips.component';
import { AccountComponent } from './account/account.component';
import { AuthGuardService } from './auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full'},
  { path: 'search', component: SearchComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'faq', component: FAQComponent },
  { path: 'feedback', component: FeedbackComponent },
  {path: 'tracked-trips', component: TrackedTripsComponent, canActivate: [AuthGuardService]},
  {path: 'account', component: AccountComponent, canActivate: [AuthGuardService]},
  {path: '**', component: PageNotFoundComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }