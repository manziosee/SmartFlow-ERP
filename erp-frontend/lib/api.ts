/**
 * SmartFlow ERP — Centralized API Service Layer
 * All API calls go through this file. Never use fetch() directly in components.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const AI_URL = process.env.NEXT_PUBLIC_AI_API_URL!;
const RULES_URL = process.env.NEXT_PUBLIC_RULES_API_URL!;

// ─── Auth Header Helper ────────────────────────────────────────────────────
function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─── Generic Fetch Wrapper ─────────────────────────────────────────────────
async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { ...getAuthHeaders(), ...(options.headers ?? {}) },
  });
  
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    const err = await res.text();
    throw new Error(err || `HTTP ${res.status}`);
  }
  
  // 204 No Content
  if (res.status === 204) return null as T;
  return res.json();
}

// ─── TYPES ─────────────────────────────────────────────────────────────────
export interface AuthResponse {
  token: string;
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface Invoice {
  id: number;
  invoiceNumber?: string;
  client: { id: number; name: string; email: string };
  amount: number;
  status: string;
  issueDate: string;
  dueDate: string;
  items?: any[];
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  riskIndex?: number;
  averagePaymentDelayDays?: number;
  monthlyRate?: number;
  preferredBillingDay?: number;
}

export interface Payment {
  id: number;
  invoice: Invoice;
  amount: number;
  paymentDate: string;
  method: string;
  status: string;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  status: string;
  date: string;
  submittedBy?: string;
}

export interface Notification {
  id: number;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: number;
  action: string;
  entityType: string;
  entityId: string;
  performedBy: string;
  timestamp: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  description?: string;
  category?: string;
  unitPrice: number;
  costPrice: number;
  stockQuantity: number;
  minStockLevel: number;
  location?: string;
}

export interface Vendor {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  contactPerson?: string;
  company?: string;
  address?: string;
  category?: string;
  totalPurchasedAmount: number;
  balanceDue: number;
  reliabilityScore: number;
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: string;
  jobTitle?: string;
  baseSalary: number;
  status: string;
}

export interface TaxRule {
  id: number;
  region: string;
  taxType: string;
  rate: number;
  active: boolean;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  outstandingInvoices: number;
  activeClients: number;
  clientsWithInvoices: number;
  overdueAmount: number;
  paidInvoices: number;
  pendingInvoices: number;
}

export interface CashflowEntry {
  period: string;
  inflow: number;
  outflow: number;
  net: number;
}

export interface AiInsight {
  type: string;
  priority: string;
  title: string;
  description: string;
  targetId?: string;
}

export interface CashflowForecast {
  period: string;
  projected_inflow: number;
  projected_outflow: number;
  net_cashflow: number;
  confidence: number;
}

export interface RecoveryCase {
  id: number;
  invoice: Invoice;
  status: string;
  assignedAgent?: string;
  notes?: string;
  initiatedAt: string;
}

// ─── AUTH ──────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<AuthResponse>(`${API_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (data: { name: string; email: string; password: string; company?: string }) =>
    apiFetch<AuthResponse>(`${API_URL}/auth/register`, {
      method: "POST",
      body: JSON.stringify({ ...data, role: "CLIENT" }),
    }),
};

// ─── ANALYTICS ────────────────────────────────────────────────────────────
export const analyticsApi = {
  getSummary: () => apiFetch<AnalyticsSummary>(`${API_URL}/analytics/summary`),
  getCashflow: () => apiFetch<CashflowEntry[]>(`${API_URL}/analytics/cashflow`),
};

// ─── INVOICES ─────────────────────────────────────────────────────────────
export const invoicesApi = {
  getAll: (period?: string) => apiFetch<Invoice[]>(`${API_URL}/invoices${period ? `?period=${period}` : ''}`),
  getById: (id: number | string) => apiFetch<any>(`${API_URL}/invoices/${id}`),
  create: (data: Partial<Invoice>) =>
    apiFetch<Invoice>(`${API_URL}/invoices`, { method: "POST", body: JSON.stringify(data) }),
  sendReminder: (id: number) =>
    apiFetch<void>(`${API_URL}/invoices/${id}/remind`, { method: "POST" }),
  sendInvoice: (id: number) =>
    apiFetch<Invoice>(`${API_URL}/invoices/${id}/send`, { method: "POST" }),
  generateRecurring: (clientIds?: number[]) =>
    apiFetch<Invoice[]>(`${API_URL}/invoices/generate`, { method: "POST", body: clientIds ? JSON.stringify(clientIds) : undefined }),
  delete: (id: number) =>
    apiFetch<void>(`${API_URL}/invoices/${id}`, { method: "DELETE" }),
  cancel: (id: number) =>
    apiFetch<Invoice>(`${API_URL}/invoices/${id}/cancel`, { method: "POST" }),
  update: (id: number | string, data: any) =>
    apiFetch<Invoice>(`${API_URL}/invoices/${id}`, { method: "PUT", body: JSON.stringify(data) }),
};

// ─── CLIENTS ──────────────────────────────────────────────────────────────
export const clientsApi = {
  getAll: () => apiFetch<Client[]>(`${API_URL}/clients`),
  getById: (id: number) => apiFetch<Client>(`${API_URL}/clients/${id}`),
  create: (data: Partial<Client>) =>
    apiFetch<Client>(`${API_URL}/clients`, { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Client>) =>
    apiFetch<Client>(`${API_URL}/clients/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number) => apiFetch<void>(`${API_URL}/clients/${id}`, { method: "DELETE" }),
};

// ─── PAYMENTS ─────────────────────────────────────────────────────────────
export const paymentsApi = {
  getAll: () => apiFetch<Payment[]>(`${API_URL}/payments`),
  create: (data: { invoiceId: number; amount: number; method: string }) =>
    apiFetch<Payment>(`${API_URL}/payments`, { method: "POST", body: JSON.stringify(data) }),
};

// ─── EXPENSES ─────────────────────────────────────────────────────────────
export const expensesApi = {
  getAll: (period?: string) => apiFetch<Expense[]>(`${API_URL}/expenses${period ? `?period=${period}` : ''}`),
  getById: (id: number | string) => apiFetch<Expense>(`${API_URL}/expenses/${id}`),
  create: (data: Partial<Expense>) =>
    apiFetch<Expense>(`${API_URL}/expenses`, { method: "POST", body: JSON.stringify(data) }),
  delete: (id: number | string) => apiFetch<void>(`${API_URL}/expenses/${id}`, { method: "DELETE" }),
  update: (id: number | string, data: any) =>
    apiFetch<Expense>(`${API_URL}/expenses/${id}`, { method: "PUT", body: JSON.stringify(data) }),
};

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────
export const notificationsApi = {
  getAll: () => apiFetch<Notification[]>(`${API_URL}/notifications`),
  markRead: (id: number) =>
    apiFetch<void>(`${API_URL}/notifications/${id}/read`, { method: "PATCH" }),
};

// ─── AUDIT LOGS ───────────────────────────────────────────────────────────
export const auditApi = {
  getAll: () => apiFetch<AuditLog[]>(`${API_URL}/audit`),
};

// ─── RECOVERY ─────────────────────────────────────────────────────────────
export const recoveryApi = {
  getAll: () => apiFetch<RecoveryCase[]>(`${API_URL}/recovery`),
  initiate: (invoiceId: number) =>
    apiFetch<RecoveryCase>(`${API_URL}/recovery/${invoiceId}/initiate`, { method: "POST" }),
  updateStatus: (id: number, status: string) =>
    apiFetch<RecoveryCase>(`${API_URL}/recovery/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  addNote: (id: number, note: string) =>
    apiFetch<RecoveryCase>(`${API_URL}/recovery/${id}/notes`, {
      method: "POST",
      body: JSON.stringify({ note }),
    }),
};

// ─── MARKETPLACE ──────────────────────────────────────────────────────────
export const marketplaceApi = {
  getOffers: () => apiFetch<any[]>(`${API_URL}/marketplace/offers`),
};

// ─── AI SERVICE ───────────────────────────────────────────────────────────
// NOTE: AI_URL (Python service) may not be deployed. Route insights through
// the Java AssistantController which is always live on Fly.io.
export const aiApi = {
  getInsights: (role = "MANAGER") =>
    apiFetch<AiInsight[]>(`${API_URL}/assistant/insights?role=${role}`),
  getPeerComparison: (clientId: number) =>
    AI_URL ? apiFetch<any>(`${AI_URL}/peer-comparison?client_id=${clientId}`) : Promise.resolve(null),
  predictPayment: (data: any) =>
    AI_URL ? apiFetch<any>(`${AI_URL}/predict-payment`, { method: "POST", body: JSON.stringify(data) }) : Promise.resolve(null),
  analyzeRisk: (invoiceId: number, amount: number, daysOverdue: number, riskIndex: number) =>
    AI_URL ? apiFetch<{ risk_score: number }>(`${AI_URL}/risk/${invoiceId}?amount=${amount}&days_overdue=${daysOverdue}&client_risk_index=${riskIndex}`) : Promise.resolve({ risk_score: 0 }),
  getCashflowForecast: () =>
    AI_URL ? apiFetch<CashflowForecast[]>(`${AI_URL}/forecast/cashflow`) : Promise.resolve([]),
  categorizeExpense: (description: string, amount: number) =>
    AI_URL ? apiFetch<{ category: string; confidence: number }>(`${AI_URL}/categorize-expense`, {
      method: "POST",
      body: JSON.stringify({ description, amount }),
    }) : Promise.resolve({ category: "operations", confidence: 1.0 }),
};

// ─── RULES ENGINE ─────────────────────────────────────────────────────────
export const rulesApi = {
  calculateAllocation: (paymentAmount: number, invoices: any[]) =>
    apiFetch<any>(`${RULES_URL}/allocate`, {
      method: "POST",
      body: JSON.stringify({ payment_amount: paymentAmount, invoices }),
    }),
  getMarketplaceRecs: (profile: any) =>
    apiFetch<any[]>(`${RULES_URL}/marketplace`, {
      method: "POST",
      body: JSON.stringify(profile),
    }),
  reconcile: (entry: any, invoices: any[]) =>
    apiFetch<any[]>(`${RULES_URL}/reconcile`, {
      method: "POST",
      body: JSON.stringify({ entry, invoices }),
    }),
  calculateLateFees: (invoice: any) =>
    apiFetch<{ late_fee: number }>(`${RULES_URL}/late-fees`, {
      method: "POST",
      body: JSON.stringify(invoice),
    }),
};

// ─── BACKUPS ────────────────────────────────────────────────────────────────
export const backupApi = {
  getStats: () => apiFetch<any>(`${API_URL}/backups/stats`),
  trigger: () => apiFetch<any>(`${API_URL}/backups/trigger`, { method: "POST" }),
  schedule: (time: string) => apiFetch<any>(`${API_URL}/backups/schedule`, { method: "POST", body: JSON.stringify({ time }) }),
};

// ─── USERS ─────────────────────────────────────────────────────────────────
export const usersApi = {
  getAll: () => apiFetch<any[]>(`${API_URL}/users`),
  create: (data: any) => apiFetch<any>(`${API_URL}/users`, { method: "POST", body: JSON.stringify(data) }),
  update: (id: string | number, data: any) => apiFetch<any>(`${API_URL}/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string | number) => apiFetch<void>(`${API_URL}/users/${id}`, { method: "DELETE" }),
  resetPassword: (id: string | number, newPassword: string) => apiFetch<void>(`${API_URL}/users/${id}/reset-password`, { method: "POST", body: JSON.stringify({ newPassword }) }),
};
// ─── INVENTORY ─────────────────────────────────────────────────────────────
export const inventoryApi = {
  getAll: () => apiFetch<Product[]>(`${API_URL}/inventory`),
  getById: (id: number) => apiFetch<Product>(`${API_URL}/inventory/${id}`),
  create: (data: Partial<Product>) =>
    apiFetch<Product>(`${API_URL}/inventory`, { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Product>) =>
    apiFetch<Product>(`${API_URL}/inventory/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number) => apiFetch<void>(`${API_URL}/inventory/${id}`, { method: "DELETE" }),
  getLedger: () => apiFetch<any[]>(`${API_URL}/inventory/ledger`),
  getProductLedger: (id: number) => apiFetch<any[]>(`${API_URL}/inventory/${id}/ledger`),
  getForecast: (sku: string, currentStock: number, avgDailySales: number) =>
    apiFetch<any>(`${AI_URL}/forecast/inventory/${sku}?current_stock=${currentStock}&avg_daily_sales=${avgDailySales}`),
};

// ─── VENDORS ──────────────────────────────────────────────────────────────
export const vendorsApi = {
  getAll: () => apiFetch<Vendor[]>(`${API_URL}/vendors`),
  getById: (id: number) => apiFetch<Vendor>(`${API_URL}/vendors/${id}`),
  create: (data: Partial<Vendor>) =>
    apiFetch<Vendor>(`${API_URL}/vendors`, { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Vendor>) =>
    apiFetch<Vendor>(`${API_URL}/vendors/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number) => apiFetch<void>(`${API_URL}/vendors/${id}`, { method: "DELETE" }),
};

// ─── HR & PAYROLL ──────────────────────────────────────────────────────────
export const hrApi = {
  getEmployees: () => apiFetch<Employee[]>(`${API_URL}/hr/employees`),
  getEmployee: (id: number) => apiFetch<Employee>(`${API_URL}/hr/employees/${id}`),
  createEmployee: (data: any) =>
    apiFetch<Employee>(`${API_URL}/hr/employees`, { method: "POST", body: JSON.stringify(data) }),
  updateEmployee: (id: number, data: any) =>
    apiFetch<Employee>(`${API_URL}/hr/employees/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteEmployee: (id: number) =>
    apiFetch<void>(`${API_URL}/hr/employees/${id}`, { method: "DELETE" }),
  calculatePayroll: (gross: number) => 
    apiFetch<any>(`${API_URL}/hr/payroll/calculate`, { 
      method: "POST", 
      body: JSON.stringify({ grossAmount: gross }) 
    }),
  getBenefits: () => apiFetch<any>(`${API_URL}/hr/payroll/benefits`),
  getCompliance: () => apiFetch<any>(`${API_URL}/hr/payroll/compliance`),
};

// ─── TAXES ────────────────────────────────────────────────────────────────
export const taxesApi = {
  getRules: () => apiFetch<TaxRule[]>(`${API_URL}/taxes/rules`),
  calculateRate: (region: string, category: string) =>
    apiFetch<{ tax_rate: number }>(`${RULES_URL}/tax-rate`, { method: "POST", body: JSON.stringify({ region, category }) }),
};
