import { Component, OnInit, inject, computed } from '@angular/core';
import { UserService } from '@services/user.service';
import { UserStore } from '@services/store/user-store.service';

@Component({
  selector: 'app-user-list',
  imports: [],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList implements OnInit{

private readonly userService = inject(UserService) 
private readonly store = inject(UserStore) 


protected userData = computed(() => this.store.users())


  public async ngOnInit(): Promise<void> {
      const users = await this.userService.loadUsers();
      // console.log('users', this.store.users())
  }

}
