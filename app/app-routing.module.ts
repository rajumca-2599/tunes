import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  //{path: "" , component:LoginComponent},
  //{path: "login" , component:LoginComponent},
  {path:"",loadChildren:()=>import("./auth/auth.module").then(m=>m.AuthModule)},
  {path:"login",loadChildren:()=>import("./auth/auth.module").then(m=>m.AuthModule)},
  {path:"home",loadChildren:()=>import("./home/home.module").then(m=>m.HomeModule)},
  //{ path: "packages", loadChildren: () => import("./packages/packages.module").then(m => m.PackagesModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
