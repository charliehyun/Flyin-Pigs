import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRoute, ParamMap } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { ResultsComponent } from './results/results.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full'},
  { path: 'search', component: SearchComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }