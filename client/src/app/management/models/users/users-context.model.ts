import { UserContext } from './user-context.model';

export interface UsersContext {
  totalCount: number;
  users: UserContext[];
}
