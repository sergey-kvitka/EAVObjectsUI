import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ObjectsComponent} from "./objects/objects.component";

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'objects', component: ObjectsComponent},
  {path: '', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
