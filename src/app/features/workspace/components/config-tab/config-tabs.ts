import { Component, input, output } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ApiRequest } from '../../../../core/interfaces/api-request.interface';

@Component({
  selector: 'app-config-tabs',
  imports: [MatTabsModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './config-tabs.html',
  styleUrl: './config-tabs.css',
})
export class ConfigTabs {
  requestData = input<ApiRequest>();

  change = output<Partial<ApiRequest>>();

  onBodyInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    const normalized = value?.toString().trim().length ? value : null;
    this.change.emit({ body: normalized });
  }

onParamsChange(event: Event): void {
  const container = (event.target as HTMLElement).closest('tr');
  const inputs = container?.querySelectorAll('input') as NodeListOf<HTMLInputElement>;

  const key = inputs[0].value;
  const val = inputs[1].value;
  const desc = inputs[2].value;

  const isAnyFilled = key.trim() || val.trim() || desc.trim();

  if (!isAnyFilled) {
    this.change.emit({ params: null });
  } else {
    this.change.emit({
      params: { key: key.trim(), value: val.trim(), description: desc.trim() }
    });
  }
}

onHeadersChange(event: Event): void {
  const container = (event.target as HTMLElement).closest('tr');
  const inputs = container?.querySelectorAll('input') as NodeListOf<HTMLInputElement>;

  if (!inputs || inputs.length < 2) return;

  const key = inputs[0].value.trim();
  const value = inputs[1].value.trim();

  if (!key && !value) {
    this.change.emit({ headers: null });
  } else {
    this.change.emit({
      headers: { [key]: value } 
    });
  }
}

  onAuthTokenChange(token: string): void {
    const auth: ApiRequest['auth'] = token?.toString().trim()
      ? { type: 'bearer', token }
      : { type: 'none' };
    const current = this.requestData()?.headers || {};
    const nextHeaders = { ...current } as Record<string, string>;

    if (token?.toString().trim()) {
      nextHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      delete nextHeaders['Authorization'];
    }

    this.change.emit({ auth, headers: nextHeaders });
  }
}
