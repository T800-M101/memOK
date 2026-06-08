import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Topbar } from './features/topbar/topbar';
import { Sidebar } from './features/sidebar/sidebar';
import { Workspace } from './features/workspace/workspace';
import { RequestsService } from './core/services/requests/requests-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    Topbar,
    Sidebar,
    Workspace,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatSelectModule,
    MatExpansionModule,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  requestsService = inject(RequestsService);
  protected readonly title = signal('test');
}
