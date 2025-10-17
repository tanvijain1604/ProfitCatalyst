import { Role } from '../types';

export const ROLES: Record<string, Role> = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  ANALYST: 'Analyst',
  VIEWER: 'Viewer',
};

// Defines which pages each role can access using a Map for robust lookups.
const PAGE_PERMISSIONS = new Map<Role, string[]>([
  ['Admin', ['Dashboard', 'Profitability', 'Clients', 'Sales & Marketing', 'Reporting', 'Settings']],
  ['Manager', ['Dashboard', 'Profitability', 'Clients', 'Sales & Marketing', 'Reporting', 'Settings']],
  ['Analyst', ['Dashboard', 'Profitability', 'Clients', 'Reporting']],
  ['Viewer', ['Dashboard']],
]);

// Defines access to specific tabs within the Settings page.
const SETTINGS_TAB_PERMISSIONS = new Map<Role, string[]>([
  ['Admin', ['profile', 'billing', 'notifications', 'integrations', 'api-keys']],
  ['Manager', ['profile', 'api-keys']],
  ['Analyst', []],
  ['Viewer', []],
]);

// Defines permissions for specific actions within components.
const ACTION_PERMISSIONS = new Map<Role, string[]>([
    ['Admin', ['clients:add', 'reports:generate']],
    ['Manager', ['clients:add']],
    ['Analyst', []],
    ['Viewer', []],
]);


export const hasPageAccess = (role: Role, pageId: string): boolean => {
  return PAGE_PERMISSIONS.get(role)?.includes(pageId) ?? false;
};

export const hasSettingTabAccess = (role: Role, tabId: string): boolean => {
    return SETTINGS_TAB_PERMISSIONS.get(role)?.includes(tabId) ?? false;
}

export const hasActionPermission = (role: Role, action: string): boolean => {
    return ACTION_PERMISSIONS.get(role)?.includes(action) ?? false;
}