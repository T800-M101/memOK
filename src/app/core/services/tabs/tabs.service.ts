import { Injectable, signal } from "@angular/core";
import { ApiRequest } from "../../interfaces/api-request.interfce";

@Injectable({
  providedIn: 'root',
})
export class TabsService {
  private readonly _tabs = signal<ApiRequest[]>([]);

  readonly tabs = this._tabs.asReadonly();

  private readonly _selectedTabIndex = signal<number>(0);

  readonly selectedTabIndex = this._selectedTabIndex.asReadonly();

  openTab(request: ApiRequest) {
    const exists = this._tabs().find(
      (r) => r.requestId === request.requestId,
    );

    if (exists) {
      const index = this._tabs().findIndex(
        (r) => r.requestId === request.requestId,
      );

      this._selectedTabIndex.set(index);

      return;
    }

    this._tabs.update((tabs) => [
      ...tabs,
      request,
    ]);

    this._selectedTabIndex.set(
      this._tabs().length - 1,
    );
  }

  closeTab(index: number) {
    this._tabs.update((tabs) =>
      tabs.filter((_, i) => i !== index),
    );

    const totalTabs = this._tabs().length;

    if (
      this._selectedTabIndex() >= totalTabs
    ) {
      this._selectedTabIndex.set(
        Math.max(0, totalTabs - 1),
      );
    }
  }

  setActiveTab(index: number) {
    this._selectedTabIndex.set(index);
  }

  clearTabs() {
    this._tabs.set([]);
    this._selectedTabIndex.set(0);
  }
}
