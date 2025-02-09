import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-user-login-form',
  standalone: true,
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
})
export class UserLoginFormComponent {
  @Input() userData = { username: '', password: '' };
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    public router: Router
  ) {

  }

  public logInUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe({
      next: (res: any) => {
        this.snackBar.open(
          `Login success, Welcome ${res.user.username}`,
          'OK',
          {
            duration: 2000,
          }
        );
        let user = {
          ...res.user,
          id: res.user._id,
          password: this.userData.password,
          token: res.token,
        };
        localStorage.setItem('user', JSON.stringify(user));
      },
      error: (error) => {
        this.snackBar.open('Login failed: ' + error.message, 'OK', {
          duration: 2000,
        });
      }
    });
  }
}