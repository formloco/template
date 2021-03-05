import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpConfig} from './interceptor/httpconfig.interceptor';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { PinComponent } from './component/pin/pin.component';
import { AdminComponent } from './component/admin/admin.component';
import { TemplateComponent } from './component/template/template.component';

import { MaterialModule } from "./material.module";

import { AuthService } from './service/auth.service';
import { AuthGuard } from './service/auth-guard.service';
import { TemplateService } from './service/template.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    PinComponent,
    AdminComponent,
    TemplateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
  ],
  exports:[
    PinComponent,
    AdminComponent,
    TemplateComponent
  ],
  providers: [AuthService, AuthGuard,TemplateService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfig,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
