import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { User } from 'src/interfaces/User';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  username!: string;
  password!: string;
  errorMessage!: string;
  users!: User[];
  subscription = new Subscription();

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  logIn() {
    const user = this.users.find(
      (u) => u.username === this.username && u.password === this.password
    );
    if (user) {
      this.cookieService.set('loggedAdminUser', this.username, 1);
      this.router.navigateByUrl('/dashboard');
    } else {
      this.errorMessage = 'Incorrect username or password!';
    }
  }
}
