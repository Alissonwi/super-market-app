import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormService } from './form.service';
import { HttpService } from './http.service';
import { UploadFileService } from './upload-file.service'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    FormService,
    HttpService,
    UploadFileService
    ]
})
export class ServicesModule { }
