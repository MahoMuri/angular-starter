import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username!: string;
  password!: string;
  errorMessage!: string;

  constructor(private router: Router, private cookieService: CookieService) {}

  logIn() {
    if (this.username === 'mahomuri' && this.password === 'password123') {
      this.cookieService.set('loggedAdminUser', this.username, 1);
      this.router.navigateByUrl('/dashboard');
      console.log('Logged in!');
    } else {
      this.errorMessage = 'Incorrect username or password!';
    }
  }
}
