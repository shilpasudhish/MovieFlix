import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatCardActions,
    MatCardTitle,
    MatCard,
    MatCardHeader,
    MatCardSubtitle,
    MatSnackBarModule,
    MatCardContent,
    CommonModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  public user: any = {}; 
  public favoriteMovies: any[] = [];

  constructor(
    private _fetchApiData: FetchApiDataService,
    public router: Router
  ) {
    this.user = JSON.parse(localStorage.getItem('user') || '');
  }

  /**
   * Lifecycle hook that is called when the component is initialized.
   * This function makes a call to the getUser() function to retrieve
   * the user's data and store it in the local user object.
   */
  public ngOnInit(): void {
    this.getUser();
    this.getfavoriteMovies();
  }

  /**
   * Updates the user's information in the database and in local storage.
   * This function calls the editUser() function in the FetchApiDataService
   * and updates the local user object with the response. It also calls
   * the getfavoriteMovies() function to update the favorite movies array.
   */
  public updateUser(): void {
    this._fetchApiData.editUser(this.user).subscribe(
      (res: any) => {
        if(res) {
          this.user = {
            ...res,
            id: res._id,
            password: this.user.password,
            token: this.user.token,
          };
          localStorage.setItem('user', JSON.stringify(this.user));
          this.getfavoriteMovies();
        }
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

  /**
   * Resets the local user object with the user data stored in local storage.
   * This method is useful for restoring the user information to its last known
   * state from the local storage.
   */

  public resetUser(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '');
  }

  /**
   * Redirects the user to the movies page.
   */
  public backToMovie(): void {
    this.router.navigate(['movies']);
  }

  /**
   * Gets the favorite movies for the current user from the database and updates the component's
   * favoriteMovies array.
   */
  public getfavoriteMovies(): void {
    this._fetchApiData.getAllMovies().subscribe(
      (res: any) => {
        this.favoriteMovies = res.filter((movie: any) => {
          return this.user.favorites.includes(movie._id);
        });
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

  /**
   * Gets the user information from the database and updates the local user object
   */
  public getUser(): void {
    this._fetchApiData.getUser(this.user.username).subscribe((res: any) => {
      if(res) {
        this.user = {
          ...res,
          id: res._id,
          password: this.user.password,
          token: this.user.token,
        };
        localStorage.setItem('user', JSON.stringify(this.user));
        this.getfavoriteMovies();
      }
    });
  }

/**
 * Removes a movie from the user's list of favorite movies.
 * This function uses the FetchApiDataService to call the deleteFavoriteMovie
 * API endpoint, updating the local user object and favoriteMovies array
 * with the response.
 * 
 * @param movie - The movie object to be removed from favorites.
 */

  public removeFromFavorite(movie: any): void {
    this._fetchApiData.deleteFavoriteMovie(this.user.username, movie.title).subscribe(
      (res: any) => {
        this.user.favoriteMovies = res.favoriteMovies;
        this.getfavoriteMovies();
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

/**
 * Logs the user out by navigating to the welcome page and removing the user data from local storage.
 */

  public logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['welcome']);
  }
}