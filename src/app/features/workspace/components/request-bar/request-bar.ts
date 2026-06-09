import { Component, inject, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiRequest } from '../../../../core/interfaces/api-request.interface';
import { RequestsService } from '../../../../core/services/requests/requests-service';

@Component({
  selector: 'app-request-bar',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './request-bar.html',
  styleUrl: './request-bar.css',
})
export class RequestBar {
  private fb = inject(FormBuilder);
  private requestsService = inject(RequestsService);
  requestData = input<any>();
  change = output<Partial<ApiRequest>>();

  requestForm = this.fb.group({
    method: ['GET'],
    url: [''],
  });

  ngOnInit() {
    this.requestForm.patchValue({
      method: this.requestData()?.method || 'GET',
      url: this.requestData()?.url || '',
    });
  }

  onUrlInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.requestForm.get('url')?.setValue(value, { emitEvent: false });
    this.change.emit({ url: value });
  }

  sendRequest() {
    const urlValue =
      this.requestForm.get('url')?.value?.toString().trim() || this.requestData()?.url || '';

    if (!urlValue) {
      console.error('Request URL is required before sending');
      return;
    }

    if (this.requestForm.valid) {
      const payload = {
        method: this.requestForm.get('method')?.value || 'GET',
        url: urlValue,
        headers: this.requestData()?.headers || {},
        body: this.requestData()?.body || null,
      };

      this.requestsService.sendRequest(payload);
    }
  }
}
