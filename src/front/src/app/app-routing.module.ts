import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { RepositoriesComponent } from './components/repositories/repositories.component';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { InfoComponent } from './components/info/info.component';
import { RepositoryComponent } from './components/repository/repository.component';

const routes: Routes = [
  { path: 'info', pathMatch: 'full', component: InfoComponent },
  { path: 'sign-up', pathMatch: 'full' , component: SignUpComponent },
  { path: 'sign-in', pathMatch: 'full' , component: SignInComponent },
  { path: 'repositories', pathMatch: 'full', component: RepositoriesComponent },
  { path: 'profile', pathMatch: 'full', component: ProfileComponent },
  { path: 'repositories/:repositoryId', pathMatch: 'prefix', component: RepositoryComponent},
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'}),
  ],
  exports: [
    RouterModule,
  ]
})
export class AppRoutingModule { }
