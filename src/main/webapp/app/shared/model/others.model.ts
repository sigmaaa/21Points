import { IUser } from 'app/core/user/user.model';

export interface IOthers {
  id?: number;
  description?: any;
  content?: string;
  user?: IUser;
}

export class Others implements IOthers {
  constructor(public id?: number, public description?: any, public content?: string, public user?: IUser) {}
}
