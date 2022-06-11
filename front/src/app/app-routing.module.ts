import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IdentifyUserPageComponent } from './identify-user-page/identify-user-page.component';
import { JoinPageComponent } from './join-page/join-page.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';

const routes: Routes = [
  {
    path:"welcome",component:WelcomePageComponent
  },
  {path:"join",component:JoinPageComponent},
  {path:"identifyUser/:slug",component:IdentifyUserPageComponent}
  
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
