import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/interfaces/User';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseURL = 'api/users';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  loggedAdminUser!: string;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(this.baseURL)
      .pipe(catchError(this.handleError<User[]>('getUsers', [])));
  }

  getUser(id: string): Observable<User> {
    const url = `${this.baseURL}/?id=${id}`;
    return this.http.get<User[]>(url).pipe(
      map((users) => users[0]),
      tap((res) => {
        console.log(`${res ? 'Found' : 'Did not find'} user: ${id}`);
      }),
      catchError(this.handleError<User>('getUser'))
    );
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.baseURL, user, this.httpOptions).pipe(
      tap((newUser: User) =>
        console.log(`Added new user: ${newUser.firstName}, ${newUser.lastName}`)
      ),
      catchError(this.handleError<User>('addUser'))
    );
  }

  deleteUser(id: string): Observable<User> {
    const url = `${this.baseURL}/${id}`;
    return this.http.delete<User>(url, this.httpOptions).pipe(
      tap((_) => {
        console.log(`Deleted user ${id}`);
      }),
      catchError(this.handleError<User>('deleteUser'))
    );
  }

  updateUser(user: User): Observable<any> {
    return this.http.put(this.baseURL, user, this.httpOptions).pipe(
      tap((_) => console.log(`Updated user id: ${user.id}`)),
      catchError(this.handleError<User>('updateUser'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      // console.error(`${operation} failed: ${error}`);
      return of(result as T);
    };
  }
}
