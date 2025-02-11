import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  // Replace 'your_api_url' with the actual URL of your API
  apiUrl = 'https://movie-flex-api-95d248252fac.herokuapp.com';

  constructor(private http: HttpClient) {}

  // User registration
  public userRegistration(userDetails: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/users`, userDetails)
      .pipe(catchError(this._handleError));
  }

  // User login
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, userDetails).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
      }),
      catchError(this._handleError)
    );
  }

  // Get all movies
  public getAllMovies() {
    const token = this._getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .get(`${this.apiUrl}/movies`, { headers })
      .pipe(catchError(this._handleError));
  }

  // Get one movie
  public getOneMovie(title: string) {
    return this.http
      .get(`${this.apiUrl}/movies/${title}`)
      .pipe(catchError(this._handleError));
  }

  // Get director
  public getDirector(name: string) {
    return this.http
      .get(`${this.apiUrl}/directors/${name}`)
      .pipe(catchError(this._handleError));
  }

  // Get genre
  public getGenre(name: string) {
    return this.http
      .get(`${this.apiUrl}/genres/${name}`)
      .pipe(catchError(this._handleError));
  }

  // Get user
  public getUser(username: string) {
    return this.http
      .get(`${this.apiUrl}/users/${username}`)
      .pipe(catchError(this._handleError), tap((val) => console.log(val)));
  }

  // Get favorite movies for a user
  public getFavoriteMovies(username: string) {
    return this.http
      .get(`${this.apiUrl}/users/${username}/movies`)
      .pipe(catchError(this._handleError));
  }

  // Add a movie to favorite movies
  public addFavoriteMovie(username: string, movieId: string) {
    return this.http
      .post(`${this.apiUrl}/users/${username}/movies/${movieId}`, {})
      .pipe(catchError(this._handleError));
  }

  // Edit user
  public editUser(username: string, userDetails: any) {
    return this.http
      .put(`${this.apiUrl}/users/${username}`, userDetails)
      .pipe(catchError(this._handleError));
  }

  // Delete user
  public deleteUser(username: string) {
    return this.http
      .delete(`${this.apiUrl}/users/${username}`)
      .pipe(catchError(this._handleError));
  }

  // Delete a movie from favorite movies
  public deleteFavoriteMovie(username: string, movieId: string) {
    return this.http
      .delete(`${this.apiUrl}/users/${username}/movies/${movieId}`)
      .pipe(catchError(this._handleError));
  }

  // Handle API errors
  private _handleError(error: any) {
    console.error(error);
    return throwError(() => new Error(error.message || 'Server error'));
  }

  private _getToken(): string {
    return localStorage.getItem('token') || '';
  }
}