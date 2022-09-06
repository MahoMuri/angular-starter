export type DataSource =
  | 'Facebook'
  | 'Google'
  | 'Monster Gulf'
  | 'JobsDB'
  | 'Twitter'
  | string;

export interface User {
  id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  country: string;
  nationality: string;
  company: string;
  designation: string;
  workExp: number;
  cv: string;
  dataSource: DataSource;
}
