import { Component, input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-config-tabs',
  imports: [
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './config-tabs.html',
  styleUrl: './config-tabs.css',
})
export class ConfigTabs {
  requestData = input<any>();
}
