import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServicesModule } from './services/services.module';
import { NgxSpinnerModule } from "ngx-spinner";
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgxMaskModule, IConfig } from 'ngx-mask'

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ServicesModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    MDBBootstrapModule.forRoot(),
    BrowserAnimationsModule,
    NgxMaskModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
