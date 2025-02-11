import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardActions, MatCardHeader, MatCardModule, MatCardTitle } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DetailsViewComponent } from '../details-view/details-view.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-movie-card',
  imports: [CommonModule, MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatCardHeader, MatCardTitle, MatCardActions],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})

export class MovieCardComponent implements OnInit {
  public movies: any[] = [];

  constructor(private _fetchApiData: FetchApiDataService, public snackBar: MatSnackBar, public router: Router, public dialog: MatDialog) {}

  /**
   * OnInit lifecycle hook. Initialize the component's data from the API data by calling
   * the getMovies() method. This method is called when the component is initialized.
   */
  public ngOnInit(): void {
    this.getMovies();
  }

  /**
   * Retrieves the list of movies from the API and stores them in the component's
   * movies array. If the user is logged in, the component also checks if the user
   * has favorited any of the movies and sets the isFavorite property of the
   * movie object accordingly.
   */
  public getMovies(): void {
    this._fetchApiData.getAllMovies().subscribe({
      /**
       * If the API request was successful, this callback function is called
       * with the response data as an argument. The response data is stored in
       * the component's movies array. Additionally, if the user is logged in,
       * the component iterates over the movies array and checks if the user
       * has favorited any of the movies. If they have, the isFavorite property
       * of the movie object is set to true, otherwise it is set to false.
       * @param data The response data from the API containing the list of movies.
       */
      next: (data: any) => {
        this.movies = data;

        let user = JSON.parse(localStorage.getItem('user') || '');
        if(user.favorites.length > 0) {
          this.movies.forEach((movie: any) => {
            movie.isFavorite = user.favorites.includes(movie._id);
          });
        }
      },
      /**
       * If the API request fails, this callback function is called with the error
       * object as an argument. The error message is displayed to the user using
       * the Mat SnackBar component for 2 seconds.
       * @param err The error object containing the error message.
       */
      error: (err: any) => {
        this.snackBar.open(err.message, 'OK', {
          duration: 2000,
        });
      },
    });
  }

  /**
   * Redirects the user to the profile page.
   */
  public redirectProfile(): void {
    this.router.navigate(['/profile']);
  }

  /**
   * Logs the user out of the application by clearing the local storage
   * and navigating back to the welcome page.
   */
  public logout(): void {
    localStorage.clear();
    this.router.navigate(['/welcome']);
  }

  /**
   * Opens a dialog containing information about the genre of the movie that was
   * clicked on. The dialog is displayed with a width of 500px.
   * @param movie The movie object containing the genre information.
   */
  public showGenre(movie: any): void {
    this.dialog.open(DetailsViewComponent, {
      data: { genres: movie.genre },
      width: '500px',
    });
  }

  /**
   * Opens a dialog containing information about the director of the movie that was
   * clicked on. The dialog is displayed with a width of 500px.
   * @param movie The movie object containing the director information.
   */
  public showDirector(movie: any): void {
    this.dialog.open(DetailsViewComponent, {
      data: { directors: movie.director },
      width: '500px',
    });
  }

  /**
   * Opens a dialog containing the details of the movie that was clicked on.
   * The dialog is displayed with a width of 500px.
   * @param movie The movie object containing the details of the movie.
   */
  public showDetail(movie: any): void {
    this.dialog.open(DetailsViewComponent, {
      data: { movie: movie },
      width: '500px',
    });
  }
  
  /**
   * Updates the user's favorite movies list in the database and in the local component
   * state. If the movie is already in the user's favorite movies list, it is removed,
   * otherwise it is added.
   * @param movie The movie object containing the movie information.
   */
  public updateFavoriteMovies(movie: any): void {
    const user = JSON.parse(localStorage.getItem('user') || '');
    if (!user) return;
    const username = user.username;
    if (this.isFavorite(movie)) {
      this._fetchApiData
        .deleteFavoriteMovie(username, movie._id)
        .subscribe(() => {
          this.getMovies(); 
        });
    } else {
      this._fetchApiData.addFavoriteMovie(username, movie._id).subscribe(() => {
        this.getMovies(); 
      });
    }
  }
  
  /**
   * Checks if a movie is in the user's favorite movies list.
   * @param movie The movie object to check.
   * @returns True if the movie is in the user's favorite movies list, false otherwise.
   */
  public isFavorite(movie: any): boolean {
    return this.movies.some((favMovie) => favMovie._id === movie._id);
  }
}