import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'div[app-button]',
  imports: [CommonModule],
  templateUrl: './button.html'
})
export class Button {


  buttonClicked = output()

  icon = input('');
  img = input('');
  text = input('');
  bgColor = input('');
  borderColor = input('');
  txtColor = input('');
  iconColor = input('');
  shadowColor = input('');
  type = input('');
  hover = input('');



  handleClick() {
    this.buttonClicked.emit();
  }

}
