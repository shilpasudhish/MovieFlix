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

  public ngOnInit(): void {
    this.getMovies();
  }

  public getMovies(): void {
    this._fetchApiData.getAllMovies().subscribe({
      next: (data: any) => {
        this.movies = data;

        let user = JSON.parse(localStorage.getItem('user') || '');
        if(user.favorites.length > 0) {
          this.movies.forEach((movie: any) => {
            movie.isFavorite = user.favorites.includes(movie._id);
          });
        }
      },
      error: (err: any) => {
        this.snackBar.open(err.message, 'OK', {
          duration: 2000,
        });
      },
    });
  }

  public redirectProfile(): void {
    this.router.navigate(['/profile']);
  }

  public logout(): void {
    localStorage.clear();
    this.router.navigate(['/welcome']);
  }

  public showGenre(movie: any): void {
    this.dialog.open(DetailsViewComponent, {
      data: { genres: movie.genre },
      width: '500px',
    });
  }

  public showDirector(movie: any): void {
    this.dialog.open(DetailsViewComponent, {
      data: { directors: movie.director },
      width: '500px',
    });
  }

  public showDetail(movie: any): void {
    this.dialog.open(DetailsViewComponent, {
      data: { movie: movie },
      width: '500px',
    });
  }
  
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
  
  public isFavorite(movie: any): boolean {
    return this.movies.some((favMovie) => favMovie._id === movie._id);
  }
}