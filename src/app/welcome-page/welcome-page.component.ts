import { Component } from '@angular/core';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatDialog } from '@angular/material/dialog';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
  imports: [MatButtonModule]
})
export class WelcomePageComponent {

  constructor(public dialog: MatDialog) {}

  /**
   * Opens a dialog for user registration.
   * @returns {void}
   */
  public openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '300px',
    });
  }

  /**
   * Opens a dialog for user login.
   * @returns {void}
   */
  public openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '300px',
    });
  }
}