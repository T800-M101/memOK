import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RequestBar } from './components/request-bar/request-bar';
import { ConfigTabs } from './components/config-tab/config-tabs';
import { ResponseSection } from './components/response-section/response-section';

@Component({
  selector: 'app-worksapce',
  imports: [MatTabsModule, RequestBar, ConfigTabs, ResponseSection],
  templateUrl: './workspace.html',
  styleUrl: './workspace.css',
})
export class Workspace {}
