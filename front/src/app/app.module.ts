import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { MatButtonModule } from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon';
import { JoinPageComponent } from './join-page/join-page.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { IdentifyUserPageComponent } from './identify-user-page/identify-user-page.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTableModule} from '@angular/material/table';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


// Scanner
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { CreateRoomComponent } from './create-room/create-room.component';
import { FormsModule } from '@angular/forms';
import { IdentifyAdminComponent } from './identify-admin/identify-admin.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { QRCodeModule } from 'angularx-qrcode';
import { UserPageComponent } from './user-page/user-page.component';



@NgModule({
  declarations: [
    AppComponent,
    WelcomePageComponent,
    JoinPageComponent,
    IdentifyUserPageComponent,
    CreateRoomComponent,
    IdentifyAdminComponent,
    AdminPageComponent,
    UserPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatStepperModule,
    MatTableModule,
    ReactiveFormsModule,
    ZXingScannerModule,
    FormsModule,
    MatDividerModule,
    MatListModule,
    QRCodeModule,
    MatProgressSpinnerModule
  ],
  providers: [WelcomePageComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
