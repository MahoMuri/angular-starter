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
    return this.http.get<User[]>(this.baseURL);
  }

  getUser(id: string): Observable<User> {
    const url = `${this.baseURL}/?id=${id}`;
    return this.http.get<User[]>(url).pipe(map((users) => users[0]));
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.baseURL, user, this.httpOptions);
  }

  deleteUser(id: string): Observable<User> {
    const url = `${this.baseURL}/${id}`;
    return this.http.delete<User>(url, this.httpOptions);
  }

  updateUser(user: User): Observable<any> {
    return this.http.put(this.baseURL, user, this.httpOptions);
  }
}
