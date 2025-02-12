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


  /**
   * Retrieves the user's token from local storage. If no token is found,
   * an empty string is returned.
   * @returns The user's token, or an empty string if not found.
   */
  private getToken(): string {
    return localStorage.getItem('token') || '';
  }


/**
 * Registers a new user by sending their details to the API.
 * 
 * @param userDetails - An object containing the new user's data such as username, password, email, and birthday.
 * @returns An Observable containing the server's response, which includes the registered user's information if successful.
 * If the registration fails, an error is handled.
 */

  public userRegistration(userDetails: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/users`, userDetails)
      .pipe(catchError(this.handleError));
  }

/**
 * Logs in a user. Sends the user's details to the API to authenticate
 * and retrieve a token. If the login is successful, the token is stored
 * in local storage. If the login fails, an error is handled.
 * 
 * @param userDetails - The user's credentials, including username and password.
 * @returns An Observable containing the server's response.
 */

  public userLogin(userDetails: any): Observable<any> {

    return this.http.post(`${this.apiUrl}/login`, userDetails).pipe(
      tap((response: any) => {
        // Handle response and store token
        if (response && response.token) {
          localStorage.setItem('token', response.token);
        }
      }),
      catchError(this.handleError)
    );
  }


  /**
   * Retrieves the list of movies from the API. If the user is logged in, the
   * API request is made with the user's token in the request headers. If the
   * request is successful, the API will return the list of movies, which is
   * then returned in the Observable. If the request fails, an error is thrown
   * and handled by the catchError operator.
   * @returns An Observable containing the list of movies if the request is
   * successful.
   */
  public getAllMovies(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .get(`${this.apiUrl}/movies`, { headers })
      .pipe(catchError(this.handleError));
  }


  /**
   * Retrieves a single movie from the API. If the user is logged in, the
   * API request is made with the user's token in the request headers. If the
   * request is successful, the API will return the movie's data, which is then
   * returned in the Observable. If the request fails, an error is thrown and
   * handled by the catchError operator.
   * @param title - The title of the movie to retrieve.
   * @returns An Observable containing the movie's data if the request is
   * successful.
   */
  public getOneMovie(title: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .get(`${this.apiUrl}/movies/${title}`, { headers })
      .pipe(catchError(this.handleError));
  }


  /**
   * Retrieves a single director from the API. If the user is logged in, the
   * API request is made with the user's token in the request headers. If the
   * request is successful, the API will return the director's data, which is
   * then returned in the Observable. If the request fails, an error is thrown
   * and handled by the catchError operator.
   * @param name - The name of the director to retrieve.
   * @returns An Observable containing the director's data if the request is
   * successful.
   */
  public getDirector(name: string) {
    const token = localStorage.getItem('token');
    return this.http
      .get(`${this.apiUrl}/movies/directors/${name}`, {
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
      })
      .pipe(catchError(this.handleError));
  }


  /**
   * Retrieves a single genre from the API. If the user is logged in, the
   * API request is made with the user's token in the request headers. If the
   * request is successful, the API will return the genre's data, which is
   * then returned in the Observable. If the request fails, an error is
   * thrown and handled by the catchError operator.
   *
   * @param name The name of the genre to retrieve.
   * @returns An Observable containing the genre's data if the request is
   * successful.
   */
  public getGenre(name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(`${this.apiUrl}/movies/genres/${name}`, {
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
      })
      .pipe(catchError(this.handleError));
  }


/**
 * Retrieves information about a user by username from the API.
 * If the user is logged in, the API request is made with the user's
 * token in the request headers. If the request is successful, the API
 * will return the user's data, which is then returned in the Observable.
 * If the request fails, an error is thrown and handled by the catchError
 * operator.
 * 
 * @param username - The username of the user to retrieve.
 * @returns An Observable containing the user's data if the request
 * is successful.
 */

  public getUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(`${this.apiUrl}/movies/users/${username}`, {
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
      })
      .pipe(catchError(this.handleError));
  }


  /**
   * Retrieves the list of favorite movies for a user from the API. If the user is
   * logged in, the API request is made with the user's token in the request headers.
   * If the request is successful, the API will return the list of movies, which is
   * then returned in the Observable. If the request fails, an error is thrown and
   * handled by the catchError operator.
   * @param username The username of the user whose favorite movies to retrieve.
   * @returns An Observable containing the list of favorite movies if the request
   * is successful.
   */
  public getFavoriteMovies(username: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .get(`${this.apiUrl}/users/${username}/movies`, { headers })
      .pipe(catchError(this.handleError));
  }


  /**
   * Adds a movie to a user's favorite movies list in the database. The
   * API request is made with the user's token in the request headers. If the
   * request is successful, the API will return the updated user's data, which is
   * then returned in the Observable. If the request fails, an error is thrown
   * and handled by the catchError operator.
   * @param username The username of the user whose favorite movies to update.
   * @param movieId The id of the movie to add to the user's favorite movies.
   * @returns An Observable containing the updated user's data if the request is
   * successful.
   */
  public addFavoriteMovie(username: string, movieId: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .post(
        `${this.apiUrl}/users/${username}/movies/${movieId}`,
        {},
        { headers }
      )
      .pipe(catchError(this.handleError));
  }


/**
 * Updates the user's data in the database using their username. The API request
 * is made with the user's token in the request headers. If the request is successful,
 * the API will return the updated user's data, which is then returned in the Observable.
 * If the request fails, an error is thrown and handled by the catchError operator.
 * 
 * @param userDetails The user's data to update in the database.
 * @returns An Observable containing the updated user's data if the request is successful.
 */

  public editUser(userDetails: any): Observable<any> {
    const token = this.getToken();
    return this.http
      .put(`${this.apiUrl}/users/${userDetails.username}`, userDetails, {
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
      })
      .pipe(catchError(this.handleError));
  }



  /**
   * Deletes a user from the database using their username. The API request
   * is made with the user's token in the request headers. If the request is
   * successful, the user is removed from the database. If the request fails,
   * an error is thrown and handled by the catchError operator.
   * @param username The username of the user to delete.
   * @returns An Observable containing the response from the API if the
   * request is successful.
   */
  public deleteUser(username: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .delete(`${this.apiUrl}/users/${username}`, { headers })
      .pipe(catchError(this.handleError));
  }


  /**
   * Deletes a movie from a user's favorite movies list in the database. The
   * API request is made with the user's token in the request headers. If the
   * request is successful, the movie is removed from the user's favorite movies
   * list. If the request fails, an error is thrown and handled by the catchError
   * operator.
   * @param username The username of the user whose favorite movies to update.
   * @param movieId The id of the movie to delete from the user's favorite movies.
   * @returns An Observable containing the response from the API if the request
   * is successful.
   */
  public deleteFavoriteMovie(
    username: string,
    movieId: string
  ): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .delete(`${this.apiUrl}/users/${username}/movies/${movieId}`, { headers })
      .pipe(catchError(this.handleError));
  }


  /**
   * Handles any errors that occur when making an API request. The error is
   * logged to the console and then re-thrown as an Observable using the
   * throwError operator from RxJS. This allows the error to be handled by
   * the catchError operator in the component that made the API request.
   * @param error The error object containing the error message.
   * @returns An Observable containing the error message if the request fails.
   */
  private handleError(error: any) {
    console.error(error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
  
}