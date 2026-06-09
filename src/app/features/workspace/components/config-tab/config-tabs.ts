import { Component, inject, input, output } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiRequest } from '../../../../core/interfaces/api-request.interface';

@Component({
  selector: 'app-config-tabs',
  imports: [MatTabsModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule],
  templateUrl: './config-tabs.html',
  styleUrl: './config-tabs.css',
})
export class ConfigTabs {
  private fb = inject(FormBuilder);

  requestData = input<ApiRequest>();
  change = output<Partial<ApiRequest>>();

  paramsForm: FormGroup;
  headersForm: FormGroup;

  constructor() {
    this.paramsForm = this.fb.group({
      params: this.fb.array([])
    });

    this.headersForm = this.fb.group({
      headers: this.fb.array([])
    });
  }

  get paramsArray(): FormArray {
    return this.paramsForm.get('params') as FormArray;
  }

  get headersArray(): FormArray {
    return this.headersForm.get('headers') as FormArray;
  }

  ngOnInit() {
    this.initForms();
    this.subscribeToFormChanges();
  }

  ngOnDestroy() {
    // Limpiar subscriptions si es necesario
  }

  initForms() {
    // Inicializar parámetros desde requestData
    const existingParams = this.requestData()?.params || {};
    const paramKeys = Object.keys(existingParams);

    if (paramKeys.length > 0) {
      for (const key of paramKeys) {
        this.addParam(key, existingParams[key]);
      }
    } else {
      this.addParam('', '');
    }

    // Inicializar headers desde requestData
    const existingHeaders = this.requestData()?.headers || {};
    const headerKeys = Object.keys(existingHeaders);

    // Filtrar Authorization porque se maneja en el tab de Auth
    const filteredHeaders = headerKeys.filter(key => key !== 'Authorization');

    if (filteredHeaders.length > 0) {
      for (const key of filteredHeaders) {
        this.addHeader(key, existingHeaders[key]);
      }
    } else {
      this.addHeader('', '');
    }
  }

  subscribeToFormChanges() {
    this.paramsArray.valueChanges.subscribe(() => {
      this.emitParamsChange();
    });

    this.headersArray.valueChanges.subscribe(() => {
      this.emitHeadersChange();
    });
  }

  createParamGroup(key: string = '', value: string = '', description: string = ''): FormGroup {
    return this.fb.group({
      key: [key],
      value: [value],
      description: [description]
    });
  }

  createHeaderGroup(key: string = '', value: string = ''): FormGroup {
    return this.fb.group({
      key: [key],
      value: [value]
    });
  }

  addParam(key: string = '', value: string = '', description: string = '') {
    this.paramsArray.push(this.createParamGroup(key, value, description));
  }

  addHeader(key: string = '', value: string = '') {
    this.headersArray.push(this.createHeaderGroup(key, value));
  }

  removeParam(index: number) {
    this.paramsArray.removeAt(index);
  }

  removeHeader(index: number) {
    this.headersArray.removeAt(index);
  }

  emitParamsChange() {
    const validParams: Record<string, string> = {};
    let hasValidParams = false;

    this.paramsArray.controls.forEach(group => {
      const key = group.get('key')?.value?.trim();
      const value = group.get('value')?.value?.trim();

      if (key) {
        validParams[key] = value || '';
        hasValidParams = true;
      }
    });

    this.change.emit({
      params: hasValidParams ? validParams : null
    });
  }

  emitHeadersChange() {
    const validHeaders: Record<string, string> = {};
    let hasValidHeaders = false;

    this.headersArray.controls.forEach(group => {
      const key = group.get('key')?.value?.trim();
      const value = group.get('value')?.value?.trim();

      if (key) {
        validHeaders[key] = value || '';
        hasValidHeaders = true;
      }
    });

    this.change.emit({
      headers: hasValidHeaders ? validHeaders : null
    });
  }

  onBodyInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    const normalized = value?.toString().trim().length ? value : null;
    this.change.emit({ body: normalized });
  }

  onAuthTokenChange(token: string): void {
    const auth: ApiRequest['auth'] = token?.toString().trim()
      ? { type: 'bearer', token: token.trim() }
      : { type: 'none' };

    const current = this.requestData()?.headers || {};
    const nextHeaders = { ...current } as Record<string, string>;

    if (token?.toString().trim()) {
      nextHeaders['Authorization'] = `Bearer ${token.trim()}`;
    } else {
      delete nextHeaders['Authorization'];
    }

    this.change.emit({ auth, headers: nextHeaders });
  }
}
