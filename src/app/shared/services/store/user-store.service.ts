import { Injectable, signal, computed } from '@angular/core';
import { UserPublicData } from '@models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserStore {
  private readonly _users = signal<UserPublicData[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly users = this._users.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();



  readonly usersCount = computed(() => this._users().length);

  setUsers(users: UserPublicData[]): void {
    this._users.set(users);
    this._error.set(null);
    console.log('[STORE] - setUsers', this.users())
  }


  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  setError(error: string | null): void {
    this._error.set(error);
  }


  clearStore(): void {
    this._users.set([]);
    this._loading.set(false);
    this._error.set(null);
  }
}