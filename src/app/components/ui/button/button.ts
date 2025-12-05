import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

/**
 * Reusable button component with customizable styling and content.
 *
 * This is an Angular standalone component that provides a flexible button
 * with configurable colors, icons, images, and text. It emits a click event
 * that parent components can listen to.
 *
 * @component
 * @standalone
 * @selector div[app-button]
 * @example
 * <div app-button
 *      [text]="'Click me'"
 *      [bgColor]="'primary'"
 *      (buttonClicked)="handleClick()">
 * </div>
 */
@Component({
  selector: 'div[app-button]',
  imports: [CommonModule],
  templateUrl: './button.html'
})
export class Button {

  /**
   * Event emitted when the button is clicked.
   * @output
   */
  buttonClicked = output()

  /**
   * Icon class or name to display in the button.
   * @input
   */
  icon = input('');

  /**
   * Image URL to display in the button.
   * @input
   */
  img = input('');

  /**
   * Text content to display in the button.
   * @input
   */
  text = input('');

  /**
   * Background color CSS class or value.
   * @input
   */
  bgColor = input('');

  /**
   * Border color CSS class or value.
   * @input
   */
  borderColor = input('');

  /**
   * Text color CSS class or value.
   * @input
   */
  txtColor = input('');

  /**
   * Icon color CSS class or value.
   * @input
   */
  iconColor = input('');

  /**
   * Shadow color CSS class or value.
   * @input
   */
  shadowColor = input('');

  /**
   * Button type (e.g., 'submit', 'button', 'reset').
   * @input
   */
  type = input('');

  /**
   * Hover effect CSS class or configuration.
   * @input
   */
  hover = input('');

  /**
   * Handles the button click event.
   *
   * Emits the buttonClicked output event when the button is clicked.
   *
   * @public
   * @returns {void}
   */
  handleClick() {
    this.buttonClicked.emit();
  }

}
