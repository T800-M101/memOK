import { MatIconModule } from '@angular/material/icon';
import { Component, computed, inject, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RequestBar } from './components/request-bar/request-bar';
import { ConfigTabs } from './components/config-tab/config-tabs';
import { ResponseSection } from './components/response-section/response-section';
import { TabsService } from '../../core/services/tabs/tabs.service';
import { ApiRequest } from '../../core/interfaces/api-request.interfce';
import { FormsModule } from '@angular/forms';
import { RequestsService } from '../../core/services/requests/requests-service';

@Component({
  selector: 'app-worksapce',
  imports: [MatTabsModule, MatIconModule, RequestBar, ConfigTabs, ResponseSection, FormsModule],
  templateUrl: './workspace.html',
  styleUrl: './workspace.css',
})
export class Workspace {
  private requestsService = inject(RequestsService);
  private tabsService = inject(TabsService);
  private pendingCloseIndex = signal<number | null>(null);
  activeRequests = this.tabsService.tabs;
  selectedTabIndex = this.tabsService.selectedTabIndex;
  isSaveModalOpen = signal(false);
  requestName = signal('');
  selectedCollectionId = signal<string>('');
  newCollectionTitle = signal('');
  collections = this.requestsService.collections;
  targetTabId = signal<string | null>(null);
  tabs = this.tabsService.tabs;

  isSaveDisabled = computed(() => {
    const hasRequestName = this.requestName()?.trim().length > 0;

    if (this.collections().length > 0) {
      const hasCollectionSelected = this.selectedCollectionId() !== '';
      const hasNewCollectionName =
        this.selectedCollectionId() === 'new' ? this.newCollectionTitle()?.trim().length > 0 : true;
      return !hasRequestName || !hasCollectionSelected || !hasNewCollectionName;
    } else {
      const hasNewCollection = this.newCollectionTitle()?.trim().length > 0;
      return !hasRequestName || !hasNewCollection;
    }
  });

  setActiveTab(index: number) {
    if (index === this.activeRequests().length) {
      return;
    }

    this.tabsService.setActiveTab(index);
  }

  closeTab(index: number, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    const tab = this.activeRequests()[index];
    if (!tab) return;

    this.pendingCloseIndex.set(index);
    this.targetTabId.set(tab.requestId);
    this.requestName.set(tab.name);
    this.selectedCollectionId.set('');
    this.newCollectionTitle.set('');
    this.isSaveModalOpen.set(true);
  }

  createNewTab(event: Event) {
    event.stopPropagation();

    const newRequest: ApiRequest = {
      requestId: crypto.randomUUID(),
      name: 'New Request',
      method: 'GET',
      url: '',
      params: {},
      headers: {},
      body: null,
      auth: {
        type: 'none',
      },
    };

   this.tabsService.openTab(newRequest);
    setTimeout(() => {
      const newIndex = this.activeRequests.length - 1;
      this.setActiveTab(newIndex);
    });

  }

  closeModal(): void {
    this.isSaveModalOpen.set(false);
    this.requestName.set('');
    this.newCollectionTitle.set('');
    this.selectedCollectionId.set('');
  }

  confirmSave() {
    const tabId = this.targetTabId();
    const pendingIndex = this.pendingCloseIndex();
    
    if (!tabId) {
      console.error('No tabId found');
      return;
    }

    // Find the tab that is being saved
    const tabToSave = this.tabs().find((tab) => tab.requestId === tabId);
    if (!tabToSave) {
      console.error('Tab not found:', tabId);
      return;
    }

    let finalCollectionId: string;
    let collectionName: string | undefined;

    // Determine if it is a new or existing collection
    if (this.selectedCollectionId() === 'new' || this.collections().length === 0) {
      // Case 1: Create a new collection
      finalCollectionId = crypto.randomUUID();
      collectionName = this.newCollectionTitle()?.trim() || 'New Collection';

      // Create the new collection
      this.requestsService.addCollection({
        collectionId: finalCollectionId,
        title: collectionName,
        icon: 'fas fa-folder',
        requests: [],
        isExpanded: true,
      });
    } else {
      // Case 2: Use existing collection
      finalCollectionId = this.selectedCollectionId();
      const existingCollection = this.collections().find(
        (col) => col.collectionId === finalCollectionId,
      );
      collectionName = existingCollection?.title;
    }

    // Update or create the request
    const updatedRequest: ApiRequest = {
      ...tabToSave,
      name: this.requestName()?.trim() || tabToSave.name,
      collectionId: finalCollectionId,
    };

    // Save the request in the collection
    this.saveRequestToCollection(updatedRequest, finalCollectionId);

    // Update the tab name
    this.tabsService.updateTabName(tabId, updatedRequest.name);

    // Close the tab if it was pending closure.
    if (pendingIndex !== null) {
      this.tabsService.closeTab(pendingIndex);
    }

    // Clear and close modal
    this.targetTabId.set(null);
    this.pendingCloseIndex.set(null);
    this.isSaveModalOpen.set(false);
    this.requestName.set('');
    this.newCollectionTitle.set('');
    this.selectedCollectionId.set('');
  }

  private saveRequestToCollection(request: ApiRequest, collectionId: string) {
    // Check if the request already exists in the collection
    const collection = this.requestsService
      .collections()
      .find((col) => col.collectionId === collectionId);

    if (collection) {
      const existingRequestIndex = collection.requests.findIndex(
        (req) => req.requestId === request.requestId,
      );

      if (existingRequestIndex !== -1) {
        // Update existing request
        collection.requests[existingRequestIndex] = request;
      } else {
        // Add new request
        collection.requests.push(request);
      }

      // Update the collection in the service
      this.requestsService.updateCollection(collection);
    }
  }
}
