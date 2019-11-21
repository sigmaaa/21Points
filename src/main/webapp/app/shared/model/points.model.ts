import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';

export interface IPoints {
  id?: number;
  date?: Moment;
  event?: string;
  user?: IUser;
}

export class Points implements IPoints {
  constructor(public id?: number, public date?: Moment, public event?: string, public user?: IUser) {}
}
