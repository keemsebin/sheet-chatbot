
export interface SheetConnection {
  id: string;
  name: string;
  url: string;
  status: 'connected' | 'error';
  lastUpdated: string;
  groupId?: string;
  isPublic?: boolean;
  permissions?: SheetPermissions;
  sourceInfo?: SourceInfo;
}

export interface SheetGroup {
  id: string;
  name: string;
  description?: string;
  sheets: SheetConnection[];
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  permissions: GroupPermissions;
  tags?: string[];
}

export interface GroupPermissions {
  owner: string;
  viewers: string[];
  editors: string[];
  isTemplate: boolean;
}

export interface SheetPermissions {
  canRead: boolean;
  canWrite: boolean;
  canShare: boolean;
}

export interface SourceInfo {
  sheetName: string;
  sheetUrl: string;
  cellLocation: string;
  description?: string;
  previewText?: string;
}

export interface NotificationSettings {
  id: string;
  userId: string;
  sheetGroupId: string;
  title: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  customSchedule?: string;
  notificationMethods: ('email' | 'push' | 'app')[];
  isActive: boolean;
  targetCell?: string;
  message?: string;
}
