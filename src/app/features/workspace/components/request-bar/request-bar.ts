import { Component, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ApiRequest } from '../../../../core/interfaces/api-request.interface';

@Component({
  selector: 'app-request-bar',
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './request-bar.html',
  styleUrl: './request-bar.css',
})
export class RequestBar {
  requestData = input<any>();
  change = output<Partial<ApiRequest>>();

 onUrlInput(event: Event): void {
  const value = (event.target as HTMLInputElement).value;
  this.change.emit({ url: value }); 
}
}
