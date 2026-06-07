import { ApiRequest } from "./api-request.interfce";

export interface ApiCollection {
  collectionId: string;
  title: string;
  icon?: string;
  requests: any[];
  isExpanded?: boolean;
}
