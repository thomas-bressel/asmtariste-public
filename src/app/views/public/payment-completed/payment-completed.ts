import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment-completed',
  imports: [RouterLink],
  templateUrl: './payment-completed.html',
  styleUrl: './payment-completed.scss',
  host: {
    'class': 'section error-page'
  }
})
export class PaymentCompleted {}
