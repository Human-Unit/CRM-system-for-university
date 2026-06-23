import type {
  AppInfoResponse,
  DashboardSummaryResponse,
  HealthResponse,
  LoginRequest,
  LoginResponse,
  SessionResponse,
} from "../types/backend";

type BackendRuntime = {
  Info?: () => Promise<AppInfoResponse> | AppInfoResponse;
  Health?: () => Promise<HealthResponse> | HealthResponse;
  Dashboard?: () => Promise<DashboardSummaryResponse> | DashboardSummaryResponse;
  Login?: (req: LoginRequest) => Promise<LoginResponse> | LoginResponse;
  Logout?: (token: string) => Promise<void> | void;
  CurrentSession?: (token: string) => Promise<SessionResponse> | SessionResponse;
  Can?: (resource: string, action: string, token: string) => Promise<boolean> | boolean;
};

function getRuntime(): BackendRuntime | undefined {
  const runtime = (window as Window & { backend?: BackendRuntime }).backend;
  return runtime;
}

async function invoke<T>(method: keyof BackendRuntime, ...args: any[]): Promise<T | undefined> {
  const runtime = getRuntime();
  const fn = runtime?.[method] as ((...args: any[]) => Promise<T> | T) | undefined;
  if (!fn) return undefined;
  return await fn(...args);
}

export const backend = {
  info: () => invoke<AppInfoResponse>("Info"),
  health: () => invoke<HealthResponse>("Health"),
  dashboard: () => invoke<DashboardSummaryResponse>("Dashboard"),
  login: (req: LoginRequest) => invoke<LoginResponse>("Login", req),
  logout: (token: string) => invoke<void>("Logout", token),
  currentSession: (token: string) => invoke<SessionResponse>("CurrentSession", token),
  can: (resource: string, action: string, token: string) => invoke<boolean>("Can", resource, action, token),
};
