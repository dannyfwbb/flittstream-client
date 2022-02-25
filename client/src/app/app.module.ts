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
import { FooterComponent } from './_components/footer/footer.component';
import { NavbarComponent } from './_components/navbar/navbar.component';
import { SidebarComponent } from './_components/sidebar/sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavbarComponent,
    FooterComponent,
  ],
  imports: [
    SharedModule,
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
