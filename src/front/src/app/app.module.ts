import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AppRoutingModule } from './app-routing.module';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { RepositoriesComponent } from './components/repositories/repositories.component';
import {MatTabsModule} from '@angular/material/tabs';
import { UserRepositoriesComponent } from './components/repositories/user-repositories/user-repositories.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatGridListModule} from '@angular/material/grid-list';
import { ProfileComponent } from './components/profile/profile.component';
import { InfoComponent } from './components/info/info.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RepositoryComponent, DeleteRepositoryDialog } from './components/repository/repository.component';
import {MatIconModule} from '@angular/material/icon';
import { ProfileSettingsComponent } from './components/profile/profile-settings/profile-settings.component';
import { SubscriptionComponent } from './components/profile/subscription/subscription.component';
import { CreateRepositoryComponent } from './components/repositories/create-repository/create-repository.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSelectModule} from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';
import { DeleteRepositoryComponent } from './components/repository/delete-repository/delete-repository.component';
import { UpdateRepositoryComponent } from './components/repository/update-repository/update-repository.component';
import { ShareRepositoryComponent } from './components/repository/share-repository/share-repository.component';
import { UpdateTemplatesComponent } from './components/repository/update-templates/update-templates.component';
import {MatStepperModule} from '@angular/material/stepper';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SignUpComponent,
    SignInComponent,
    RepositoriesComponent,
    UserRepositoriesComponent,
    ProfileComponent,
    InfoComponent,
    RepositoryComponent,
    ProfileSettingsComponent,
    SubscriptionComponent,
    CreateRepositoryComponent,
    DeleteRepositoryComponent,
    UpdateRepositoryComponent,
    ShareRepositoryComponent,
    UpdateTemplatesComponent,
    DeleteRepositoryDialog,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatGridListModule,
    HttpClientModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatMenuModule,
    MatStepperModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
