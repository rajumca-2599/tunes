import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ForgotpasswordComponent } from './components/forgotpassword/forgotpassword.component';
import { RBTportaldashboardComponent } from './components/rbtportaldashboard/rbtportaldashboard.component';
import { SearchsongsComponent } from './components/searchsongs/searchsongs.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: "login",
    pathMatch: 'full'
  },
  {
    path: "dashboard", component:RBTportaldashboardComponent
  },
  {
    path: "validateotp", component: ForgotpasswordComponent
  },
  {
   path:"search",component:SearchsongsComponent 
  },
  {

    path: "login", component: LoginComponent, pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
