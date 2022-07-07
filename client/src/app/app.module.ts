import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OAuthModule } from 'angular-oauth2-oidc';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastaModule } from 'ngx-toasta';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { appProviders } from './app.providers';
import { SharedModule } from './shared/shared.module';
import { SharedPrimengModule } from './shared/submodule/primeng.module';
import { LoginComponent } from './_components/login/login.component';
import { SidebarComponent } from './_components/sidebar/sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    LoginComponent,
  ],
  imports: [
    SharedModule,
    SharedPrimengModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgxSpinnerModule,
    OAuthModule.forRoot(),
    ToastaModule.forRoot(),
  ],
  providers: [
    ...appProviders,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
