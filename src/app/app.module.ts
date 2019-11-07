import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileUploadComponent } from './file-upload/file-upload.component';
import {MatDialogModule} from '@angular/material/dialog'
import {ScbService} from '../app/scb.service' ;
import { ToasterService } from 'angular2-toaster';
import { AngularFireDatabaseModule, AngularFireList } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { Ng2CloudinaryModule } from 'ng2-cloudinary';
import { FileSelectDirective, FileDropDirective,  FileUploadModule } from 'ng2-file-upload';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    
    FileUploadComponent
       
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    AngularFireDatabaseModule,
  AngularFireModule.initializeApp(environment.firebase),
  Ng2CloudinaryModule, FileUploadModule
    

  ],
  providers: [ScbService,ToasterService],
  bootstrap: [AppComponent]
})
export class AppModule { }
