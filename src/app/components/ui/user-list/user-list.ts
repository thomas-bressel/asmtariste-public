import { Component, OnInit, inject, computed } from '@angular/core';
import { UserService } from '@services/user.service';
import { UserStore } from '@services/store/user-store.service';

/**
 * User list component that displays a collection of users.
 *
 * This is an Angular standalone component that renders a list of users
 * by loading data from the UserService and displaying it through the UserStore.
 * Uses computed signals for reactive updates when user data changes.
 *
 * @component
 * @standalone
 * @implements {OnInit}
 * @selector app-user-list
 * @example
 * <app-user-list></app-user-list>
 */
@Component({
  selector: 'app-user-list',
  imports: [],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList implements OnInit{

  /**
   * Injected user service for loading user data.
   * @private
   * @readonly
   */
  private readonly userService = inject(UserService)

  /**
   * Injected user store for managing user state.
   * @private
   * @readonly
   */
  private readonly store = inject(UserStore)

  /**
   * Computed signal containing the list of users from the store.
   * Automatically updates when the store's user data changes.
   * @protected
   * @readonly
   */
  protected userData = computed(() => this.store.users())

  /**
   * Initializes the component by loading user data.
   *
   * Lifecycle hook that runs once after the component is initialized.
   * Triggers the user service to load users from the API, which then
   * updates the user store.
   *
   * @async
   * @public
   * @returns {Promise<void>} Promise that resolves when users are loaded
   */
  public async ngOnInit(): Promise<void> {
      const users = await this.userService.loadUsers();
  }

}
