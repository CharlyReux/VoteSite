import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { CreateRoomComponent } from './create-room/create-room.component';
import { IdentifyAdminComponent } from './identify-admin/identify-admin.component';
import { IdentifyUserPageComponent } from './identify-user-page/identify-user-page.component';
import { JoinPageComponent } from './join-page/join-page.component';
import { UserPageComponent } from './user-page/user-page.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';

const routes: Routes = [
  {path: "welcome", component: WelcomePageComponent},
  { path: '',   redirectTo: 'welcome', pathMatch: 'full' },
  { path: "join", component: JoinPageComponent },
  { path: "identifyUser/:slug", component: IdentifyUserPageComponent },
  { path: "create", component: CreateRoomComponent },
  { path: "identifyAdmin", component: IdentifyAdminComponent },
  { path: "adminPage/:slug", component: AdminPageComponent },
  { path: "userPage/:slug", component: UserPageComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
