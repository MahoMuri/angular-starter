import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { Generator } from 'snowflake-generator';
import { User } from 'src/interfaces/User';
import { UserService } from '../user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [MessageService],
})
export class DashboardComponent implements OnInit {
  displayInsertModal!: boolean;
  displayUpdateModal!: boolean;
  insertFormGroup!: FormGroup;
  updateFormGroup!: FormGroup;
  users!: User[];
  user!: User;
  dataSources = [
    { name: 'Facebook' },
    { name: 'Google' },
    { name: 'Monster Gulf' },
    { name: 'JobsDB' },
    { name: 'Twitter' },
  ];
  loggedAdminUser!: string;

  // FormControl Variables
  firstName!: FormControl;
  lastName!: FormControl;
  country!: FormControl;
  nationality!: FormControl;
  company!: FormControl;
  designation!: FormControl;
  workExp!: FormControl;
  dataSource!: FormControl;

  constructor(
    private router: Router,
    private userService: UserService,
    private cookieService: CookieService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    if (!this.cookieService.check('loggedAdminUser')) {
      this.router.navigateByUrl('/login');
      return;
    }
    this.createValidators();
    this.createFormGroups();
    this.getUsers();

    this.loggedAdminUser = this.cookieService.get('loggedAdminUser');
  }

  getUsers() {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
      console.log(this.users);
    });
  }

  addUser() {
    this.displayInsertModal = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'User Added!',
    });
    this.resetForm();
    // TODO: Make add function in dashboard
  }

  deleteUser() {
    // TODO: Make delete function in dashboard
  }

  updateUser() {
    // TODO: Make update function in dashboard
  }

  logOut() {
    this.cookieService.delete('loggedAdminUser');
    this.router.navigateByUrl('/login');
  }

  resetForm() {
    this.insertFormGroup.reset();
  }

  // =======================================================
  //                    Private Functions
  // =======================================================

  createFormGroups() {
    this.insertFormGroup = new FormGroup({
      firstName: this.firstName,
      lastName: this.lastName,
      country: this.country,
      nationality: this.nationality,
      company: this.company,
      designation: this.designation,
      workExp: this.workExp,
      dataSource: this.dataSource,
    });

    this.updateFormGroup = new FormGroup({
      firstName: this.firstName,
      lastName: this.lastName,
      country: this.country,
      nationality: this.nationality,
      company: this.company,
      designation: this.designation,
      workExp: this.workExp,
      dataSource: this.dataSource,
    });
  }

  createValidators() {
    this.firstName = new FormControl('', Validators.required);
    this.lastName = new FormControl('', Validators.required);
    this.country = new FormControl('', Validators.required);
    this.nationality = new FormControl('', Validators.required);
    this.company = new FormControl('', Validators.required);
    this.designation = new FormControl('', Validators.required);
    this.workExp = new FormControl('', [
      Validators.required,
      Validators.min(1),
    ]);
    this.dataSource = new FormControl('', Validators.required);
  }
}
