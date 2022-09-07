import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import _ from 'lodash';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Subscription } from 'rxjs';
import { Generator } from 'snowflake-generator';
import { DataSource, User } from 'src/interfaces/User';
import { UserService } from '../user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [MessageService],
})
export class DashboardComponent implements OnInit, OnDestroy {
  displayInsertModal!: boolean;
  displayUpdateModal!: boolean;
  displayCVModal!: boolean;
  users!: User[];
  user!: User;
  fullName!: string;
  id!: string;
  userFound!: boolean;
  dataSources = [
    { name: 'Facebook' },
    { name: 'Google' },
    { name: 'Monster Gulf' },
    { name: 'JobsDB' },
    { name: 'Twitter' },
  ];
  dataSource!: DataSource;
  loggedAdminUser!: string;
  subscriptions = new Subscription();

  // Form related Variables
  insertFormGroup!: FormGroup;
  firstName!: FormControl;
  lastName!: FormControl;
  country!: FormControl;
  nationality!: FormControl;
  company!: FormControl;
  designation!: FormControl;
  workExp!: FormControl;
  @ViewChild('op') overlayPanel!: OverlayPanel;

  constructor(
    private router: Router,
    private userService: UserService,
    private cookieService: CookieService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.createValidators();
    this.createFormGroup();
    this.getUsers();

    this.loggedAdminUser = _.startCase(
      this.cookieService.get('loggedAdminUser')
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getUsers() {
    this.subscriptions.add(
      this.userService.getUsers().subscribe((users) => {
        this.users = users;
      })
    );
  }

  addUser() {
    const invalidControls = this.hasInvalidControls();
    if (invalidControls.length) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Some fields are required!',
      });
      invalidControls.forEach((control) => {
        control.markAsDirty();
      });
      return;
    }

    this.displayInsertModal = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'User Added!',
    });

    const test: string = this.insertFormGroup.get('lastName')?.value[0];
    test.toLowerCase();

    this.user = {
      id: new Generator().generate().toString(),
      username: `${_.camelCase(
        `${this.firstName.value}${this.lastName.value}`
      )}`,
      password: 'password123',
      firstName: this.insertFormGroup.get('firstName')?.value,
      lastName: this.insertFormGroup.get('lastName')?.value,
      country: this.insertFormGroup.get('country')?.value,
      nationality: this.insertFormGroup.get('nationality')?.value,
      company: this.insertFormGroup.get('company')?.value,
      designation: this.insertFormGroup.get('designation')?.value,
      workExp: this.insertFormGroup.get('workExp')?.value,
      cv: '',
      dataSource: this.dataSource,
    };

    console.log(this.user);

    this.subscriptions.add(
      this.userService.addUser(this.user).subscribe((user) => {
        this.users.push(user);
      })
    );

    this.resetForm();
  }

  deleteUser(user: User, dashboard = this) {
    this.subscriptions.add(
      this.userService.deleteUser(user.id).subscribe({
        next() {
          dashboard.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User Deleted!',
          });
        },
        error(err) {
          dashboard.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete!',
          });
          console.error(err);
        },
        complete() {
          _.remove(dashboard.users, (u) => u === user);
        },
      })
    );
  }

  updateUser() {
    if (this.user) {
      this.subscriptions.add(
        this.userService.updateUser(this.user).subscribe(() => {
          this.users[this.users.findIndex((u) => u.id === this.user.id)] =
            this.user;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User Updated!',
          });
        })
      );
      this.displayUpdateModal = false;
    }
  }

  searchUser(id: string, isOp = false) {
    if (!id) {
      this.userFound = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'User ID cannot be blank!',
      });
      return;
    }

    this.subscriptions.add(
      this.userService.getUser(id).subscribe((res) => {
        if (!res || res.id !== id) {
          this.userFound = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'User not found!',
          });
          return;
        }

        this.userFound = true;
        this.displayUpdateModal = true;
        this.user = res;
      })
    );

    if (isOp) {
      this.overlayPanel.hide();
      this.id = '';
    }
  }

  openCVModal(user: User) {
    this.fullName = `${user.firstName} ${user.lastName}`;
    this.displayCVModal = true;
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

  private createValidators() {
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
  }

  private createFormGroup() {
    this.insertFormGroup = new FormGroup({
      firstName: this.firstName,
      lastName: this.lastName,
      country: this.country,
      nationality: this.nationality,
      company: this.company,
      designation: this.designation,
      workExp: this.workExp,
    });
  }

  private hasInvalidControls() {
    const invalidControls: AbstractControl[] = [];
    const formControls = this.insertFormGroup.controls;
    for (const name in formControls) {
      if (formControls[name].invalid) {
        invalidControls.push(formControls[name]);
      }
    }

    return invalidControls;
  }
}
