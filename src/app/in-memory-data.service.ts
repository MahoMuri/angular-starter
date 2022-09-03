import { Injectable } from '@angular/core';
import { User } from 'src/interfaces/User';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDataService {
  constructor() {}

  createDb() {
    const users: User[] = [
      {
        userId: '6001350729913074688',
        firstName: 'Brenden',
        lastName: 'Wagner',
        country: 'United States of America, California',
        nationality: 'American',
        company: 'Facebook',
        designation: 'Software Engineer',
        workExp: 8,
        cv: '',
        dataSource: 'Facebook',
      },
      {
        userId: '6001350876722103296',
        firstName: 'Cara',
        lastName: 'Stevens',
        country: 'United States of America, New york',
        nationality: 'American',
        company: 'Walmart',
        designation: 'Sales Assistant',
        workExp: 5,
        cv: '',
        dataSource: 'Google',
      },
      {
        userId: '6001350879951717376',
        firstName: 'Cedric',
        lastName: 'Kelly',
        country: 'Scotland, Glasgow City',
        nationality: 'Scottish',
        company: 'Data Tech',
        designation: 'Senior Javascript Developer',
        workExp: 7,
        cv: '',
        dataSource: 'Monster Gulf',
      },
      {
        userId: '6001350883055502336',
        firstName: 'Doris',
        lastName: 'Wilder',
        country: 'Australia, Queensland',
        nationality: 'Australian',
        company: 'Telstra',
        designation: 'Support Engineer',
        workExp: 3,
        cv: '',
        dataSource: 'JobsDB',
      },
      {
        userId: '6001350885806965760',
        firstName: 'Jenny',
        lastName: 'Chang',
        country: 'Singapore, Singapore',
        nationality: 'Chinese',
        company: 'Singapore Airlines',
        designation: 'Regional Director',
        workExp: 15,
        cv: '',
        dataSource: 'Twitter',
      },
    ];
    return { users };
  }
}
