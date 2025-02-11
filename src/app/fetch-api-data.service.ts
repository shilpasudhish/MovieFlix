import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  apiUrl = 'https://movie-flex-api-95d248252fac.herokuapp.com';

  constructor(private http: HttpClient) {}

  /**
   * Registers a new user. The user's data is sent to the API
   * in the request body. If the registration is successful,
   * the API will return the user's data, which is then returned
   * in the Observable. If the registration fails, an error
   * is thrown.
   *
   * @param userDetails The user's data, which is sent to the API
   *                    in the request body.
   * @returns An Observable containing the user's data if the
   *          registration is successful.
   */
  public userRegistration(userDetails: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/users`, userDetails)
      .pipe(catchError(this._handleError));
  }

  /**
   * Logs in a user. The user's data is sent to the API
   * in the request body. If the login is successful,
   * the API will return the user's token, which is then
   * stored in local storage. If the login fails, an error
   * is thrown.
   *
   * @param userDetails The user's data, which is sent to the API
   *                    in the request body.
   * @returns An Observable containing the user's token if the
   *          login is successful.
   */
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, userDetails).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
      }),
      catchError(this._handleError)
    );
  }


  /**
   * Gets all movies from the API. The user's token is sent
   * in the request headers. If the request is successful,
   * the API will return an array of movies, which is then
   * returned in the Observable. If the request fails, an
   * error is thrown.
   *
   * @returns An Observable containing an array of movies.
   */
  public getAllMovies() {
    const token = this._getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .get(`${this.apiUrl}/movies`, { headers })
      .pipe(catchError(this._handleError));
  }

/**
 * Retrieves a specific movie by title from the API.
 * The API request is made with the movie's title as a path parameter.
 * If the request is successful, the API will return the movie's data.
 * If the request fails, an error is thrown and handled by the catchError operator.
 *
 * @param title The title of the movie to retrieve.
 * @returns An Observable containing the movie's data if the request is successful.
 */

  public getOneMovie(title: string) {
    return this.http
      .get(`${this.apiUrl}/movies/${title}`)
      .pipe(catchError(this._handleError));
  }


/**
 * Retrieves information about a director by name from the API.
 * The API request is made with the director's name as a path parameter.
 * If the request is successful, the API will return the director's data.
 * If the request fails, an error is thrown and handled by the catchError operator.
 *
 * @param name The name of the director to retrieve.
 * @returns An Observable containing the director's data if the request is successful.
 */

  public getDirector(name: string) {
    return this.http
      .get(`${this.apiUrl}/directors/${name}`)
      .pipe(catchError(this._handleError));
  }


  /**
   * Retrieves information about a genre by name from the API.
   * The API request is made with the genre's name as a path parameter.
   * If the request is successful, the API will return the genre's data.
   * If the request fails, an error is thrown and handled by the catchError operator.
   *
   * @param name The name of the genre to retrieve.
   * @returns An Observable containing the genre's data if the request is successful.
   */
  public getGenre(name: string) {
    return this.http
      .get(`${this.apiUrl}/genres/${name}`)
      .pipe(catchError(this._handleError));
  }


  /**
   * Retrieves information about a user by username from the API.
   * The API request is made with the user's username as a path parameter.
   * If the request is successful, the API will return the user's data.
   * If the request fails, an error is thrown and handled by the catchError operator.
   *
   * @param username The username of the user to retrieve.
   * @returns An Observable containing the user's data if the request is successful.
   */
  public getUser(username: string) {
    return this.http
      .get(`${this.apiUrl}/users/${username}`)
      .pipe(catchError(this._handleError));
  }


  /**
   * Retrieves the list of favorite movies for a user from the API.
   * The API request is made with the user's username as a path parameter.
   * If the request is successful, the API will return the list of favorite movies.
   * If the request fails, an error is thrown and handled by the catchError operator.
   *
   * @param username The username of the user whose favorite movies to retrieve.
   * @returns An Observable containing the list of favorite movies if the request is successful.
   */
  public getFavoriteMovies(username: string) {
    return this.http
      .get(`${this.apiUrl}/users/${username}/movies`)
      .pipe(catchError(this._handleError));
  }


/**
 * Adds a movie to the user's list of favorite movies in the database.
 * The API request is made with the user's username and the movie's ID as path parameters.
 * If the request is successful, the movie is added to the user's favorite list.
 * If the request fails, an error is thrown and handled by the catchError operator.
 *
 * @param username The username of the user who is adding the movie to their favorites.
 * @param movieId The ID of the movie to add to the user's favorites.
 * @returns An Observable containing the response from the API if the request is successful.
 */

  public addFavoriteMovie(username: string, movieId: string) {
    return this.http
      .post(`${this.apiUrl}/users/${username}/movies/${movieId}`, {})
      .pipe(catchError(this._handleError));
  }


  /**
   * Edits a user's information in the database. The API request is made
   * with the user's username as a path parameter and the user's data as
   * the request body. If the request is successful, the user's data is
   * updated in the database. If the request fails, an error is thrown
   * and handled by the catchError operator.
   *
   * @param username The username of the user whose data to edit.
   * @param userDetails The user's data to update in the database.
   * @returns An Observable containing the response from the API if the
   *          request is successful.
   */
  public editUser(username: string, userDetails: any) {
    return this.http
      .put(`${this.apiUrl}/users/${username}`, userDetails)
      .pipe(catchError(this._handleError));
  }


/**
 * Deletes a user from the database. The API request is made with
 * the user's username as a path parameter. If the request is successful,
 * the user is removed from the database. If the request fails, an error
 * is thrown and handled by the catchError operator.
 *
 * @param username The username of the user to delete.
 * @returns An Observable containing the response from the API if the
 *          request is successful.
 */

  public deleteUser(username: string) {
    return this.http
      .delete(`${this.apiUrl}/users/${username}`)
      .pipe(catchError(this._handleError));
  }

  
  /**
   * Removes a movie from the user's favorite movies list. The API request is
   * made with the user's username and the movie's id as path parameters. If the
   * request is successful, the movie is removed from the user's favorite movies
   * list in the database. If the request fails, an error is thrown and handled
   * by the catchError operator.
   *
   * @param username The username of the user whose favorite movies to update.
   * @param movieId The id of the movie to remove from the user's favorite movies.
   * @returns An Observable containing the response from the API if the request
   *          is successful.
   */
  public deleteFavoriteMovie(username: string, movieId: string) {
    return this.http
      .delete(`${this.apiUrl}/users/${username}/movies/${movieId}`)
      .pipe(catchError(this._handleError));
  }


/**
 * Handles HTTP errors by logging the error and returning an Observable
 * that throws a new error with a message. If the error object contains
 * a message, it is used; otherwise, a default 'Server error' message is used.
 *
 * @param error The error object that contains information about the HTTP error.
 * @returns An Observable that throws a new error with a message.
 */

  private _handleError(error: any) {
    console.error(error);
    return throwError(() => new Error(error.message || 'Server error'));
  }

  /**
   * Retrieves the user's authentication token from local storage.
   * If the token is not found, an empty string is returned.
   *
   * @returns The user's authentication token if found, otherwise an empty string.
   */
  private _getToken(): string {
    return localStorage.getItem('token') || '';
  }
}