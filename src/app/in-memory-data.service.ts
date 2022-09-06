import { Injectable } from '@angular/core';
import { Generator } from 'snowflake-generator';
import { User } from 'src/interfaces/User';
import userData from '../assets/users.json';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDataService {
  constructor() {}

  createDb() {
    const users: User[] = userData.data;
    return { users };
  }

  genId(users: User[]): string {
    return users.length > 0
      ? new Generator().generate().toString()
      : users.map((u) => u.id)[0];
  }
}
