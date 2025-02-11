import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MAT_DATE_LOCALE } from '@angular/material/core'


@Component({
  selector: 'app-user-registration-form',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ], 
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  standalone: true,
  templateUrl: './user-registration-form.component.html',
  styleUrl: './user-registration-form.component.scss'
})
export class UserRegistrationFormComponent {

  public userData = { username: '', password: '', email: '', birthday: '' };
  
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) {
  }

/**
 * Registers a new user by sending the user data to the server. Converts the
 * user's birthday to an ISO string format before sending the data. Upon 
 * successful registration, closes the registration dialog and displays a 
 * success message in a snackbar. If registration fails, displays an error 
 * message in a snackbar.
 */

  public registerUser(): void {
    const dateString = this.userData.birthday; 
    this.userData.birthday = new Date(dateString).toISOString();
    this.fetchApiData.userRegistration(this.userData).subscribe({
      next: (result: any) => {
        const message = result.message || 'Registration successful!';
        this.dialogRef.close(); 
        this.snackBar.open(message, 'OK', {
          duration: 2000,
        });
      },
      error: (error: any) => {
        const errorMessage = error.message || 'Registration failed!';
        this.snackBar.open(errorMessage, 'OK', {
          duration: 2000,
        });
      }
    });
  }
}
