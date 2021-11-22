import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ModalDismissReasons, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { ObjectsComponent } from './objects/objects.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { ObjectTypeComponent } from './object-type/object-type.component';
import { ChildObjectTypeComponent } from './object-type/child-object-type/child-object-type.component';
import { AttributeComponent } from './object-type/attribute/attribute.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ObjectsComponent,
    ObjectTypeComponent,
    ChildObjectTypeComponent,
    AttributeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
