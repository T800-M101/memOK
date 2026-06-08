import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { RequestsService } from '../../core/services/requests-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  requestsService = inject(RequestsService);

  collections = this.requestsService.collections;

  private fb = inject(FormBuilder);


  isModalOpen = signal<boolean>(false);

  collectionForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
  });

  openModal(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.collectionForm.reset();
  }

  addCollection(): void {
    if (this.collectionForm.invalid) {
      this.collectionForm.markAllAsTouched();

      return;
    }

    const title = this.collectionForm.value.title ?? '';

    const collection = {
      collectionId: crypto.randomUUID(),
      title,
      icon: "fas fa-folder",
      requests: [],
      isExpanded: true,
    };

    this.requestsService.addCollection(collection);

    this.closeModal();
  }

  get title() {
    return this.collectionForm.get('title');
  }
}
