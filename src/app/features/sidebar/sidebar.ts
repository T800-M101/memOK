import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { RequestsService } from '../../core/services/requests-service';

@Component({
  selector: 'app-sidebar',
  imports: [MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatExpansionModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

  requestsService = inject(RequestsService);

  isModalOpen = signal<boolean>(false);

  collection = {
    collectionId: '1234',
    title: 'Users',
    requests: [],
    isExpanded: true
  }

 openModal(): void {
  this.isModalOpen.set(true);
 }

 closeModal(): void {
  this.isModalOpen.set(false);
 }

  addCollection(): void {
    this.requestsService.addCollection(this.collection);
    this.isModalOpen.set(false);
  }
}
