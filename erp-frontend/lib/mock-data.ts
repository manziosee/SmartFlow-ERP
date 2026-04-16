export const cashflowData = [
  { month: 'Jan', income: 42000, expenses: 28000, profit: 14000 },
  { month: 'Feb', income: 38000, expenses: 25000, profit: 13000 },
  { month: 'Mar', income: 55000, expenses: 32000, profit: 23000 },
  { month: 'Apr', income: 47000, expenses: 29000, profit: 18000 },
  { month: 'May', income: 63000, expenses: 35000, profit: 28000 },
  { month: 'Jun', income: 71000, expenses: 38000, profit: 33000 },
  { month: 'Jul', income: 68000, expenses: 40000, profit: 28000 },
  { month: 'Aug', income: 75000, expenses: 42000, profit: 33000 },
  { month: 'Sep', income: 82000, expenses: 45000, profit: 37000 },
  { month: 'Oct', income: 79000, expenses: 43000, profit: 36000 },
  { month: 'Nov', income: 91000, expenses: 50000, profit: 41000 },
  { month: 'Dec', income: 105000, expenses: 58000, profit: 47000 },
];

export const weeklyRevenueData = [
  { day: 'Mon', revenue: 12400, target: 10000 },
  { day: 'Tue', revenue: 9800, target: 10000 },
  { day: 'Wed', revenue: 15600, target: 10000 },
  { day: 'Thu', revenue: 11200, target: 10000 },
  { day: 'Fri', revenue: 18900, target: 10000 },
  { day: 'Sat', revenue: 7400, target: 10000 },
  { day: 'Sun', revenue: 5200, target: 10000 },
];

export const paymentStatusData = [
  { name: 'Paid', value: 68, color: '#10b981' },
  { name: 'Pending', value: 21, color: '#f59e0b' },
  { name: 'Overdue', value: 11, color: '#ef4444' },
];

export const expenseCategoryData = [
  { category: 'Operations', amount: 18500, color: '#3b82f6' },
  { category: 'Marketing', amount: 9200, color: '#8b5cf6' },
  { category: 'Salaries', amount: 32000, color: '#10b981' },
  { category: 'Software', amount: 4800, color: '#f59e0b' },
  { category: 'Travel', amount: 3200, color: '#ec4899' },
  { category: 'Other', amount: 2100, color: '#6b7280' },
];

export const revenueByClientData = [
  { client: 'Apex Corp', revenue: 48000, invoices: 12 },
  { client: 'TechNova', revenue: 36500, invoices: 9 },
  { client: 'BlueStar LLC', revenue: 29000, invoices: 7 },
  { client: 'Meridian Inc', revenue: 22400, invoices: 6 },
  { client: 'Global Flex', revenue: 18900, invoices: 5 },
  { client: 'Others', revenue: 41200, invoices: 24 },
];

export const invoices = [
  { id: 'INV-2401', client: 'Apex Corp', amount: 8500, date: '2024-01-15', due: '2024-02-15', status: 'paid', risk: 'low' },
  { id: 'INV-2402', client: 'TechNova', amount: 12400, date: '2024-01-18', due: '2024-02-18', status: 'pending', risk: 'medium' },
  { id: 'INV-2403', client: 'BlueStar LLC', amount: 6800, date: '2023-12-20', due: '2024-01-20', status: 'overdue', risk: 'high' },
  { id: 'INV-2404', client: 'Meridian Inc', amount: 15200, date: '2024-01-22', due: '2024-02-22', status: 'paid', risk: 'low' },
  { id: 'INV-2405', client: 'Global Flex', amount: 9100, date: '2024-01-25', due: '2024-02-25', status: 'pending', risk: 'low' },
  { id: 'INV-2406', client: 'Zenith Partners', amount: 4300, date: '2023-12-10', due: '2024-01-10', status: 'overdue', risk: 'high' },
  { id: 'INV-2407', client: 'Pinnacle Group', amount: 18700, date: '2024-01-28', due: '2024-02-28', status: 'paid', risk: 'low' },
  { id: 'INV-2408', client: 'Vortex Tech', amount: 7600, date: '2024-01-30', due: '2024-03-01', status: 'pending', risk: 'medium' },
  { id: 'INV-2409', client: 'Horizon Labs', amount: 22000, date: '2024-02-01', due: '2024-03-01', status: 'paid', risk: 'low' },
  { id: 'INV-2410', client: 'Crestwood Ltd', amount: 5500, date: '2023-11-15', due: '2023-12-15', status: 'overdue', risk: 'high' },
];

export const clients = [
  {
    id: 'CLT-001', name: 'Apex Corp', email: 'billing@apexcorp.com', phone: '+1 (555) 001-0001',
    totalRevenue: 48000, invoices: 12, paidInvoices: 11, avgDelayDays: 2, riskScore: 12, risk: 'low',
    lastPayment: '2024-01-15', industry: 'Technology', country: 'United States',
  },
  {
    id: 'CLT-002', name: 'TechNova', email: 'accounts@technova.io', phone: '+1 (555) 002-0002',
    totalRevenue: 36500, invoices: 9, paidInvoices: 7, avgDelayDays: 18, riskScore: 58, risk: 'medium',
    lastPayment: '2023-12-20', industry: 'SaaS', country: 'Canada',
  },
  {
    id: 'CLT-003', name: 'BlueStar LLC', email: 'finance@bluestarllc.com', phone: '+1 (555) 003-0003',
    totalRevenue: 29000, invoices: 7, paidInvoices: 4, avgDelayDays: 35, riskScore: 82, risk: 'high',
    lastPayment: '2023-10-05', industry: 'Retail', country: 'United Kingdom',
  },
  {
    id: 'CLT-004', name: 'Meridian Inc', email: 'ap@meridianinc.com', phone: '+1 (555) 004-0004',
    totalRevenue: 22400, invoices: 6, paidInvoices: 6, avgDelayDays: 1, riskScore: 8, risk: 'low',
    lastPayment: '2024-01-22', industry: 'Finance', country: 'Australia',
  },
  {
    id: 'CLT-005', name: 'Global Flex', email: 'payments@globalflex.co', phone: '+1 (555) 005-0005',
    totalRevenue: 18900, invoices: 5, paidInvoices: 5, avgDelayDays: 5, riskScore: 21, risk: 'low',
    lastPayment: '2024-01-10', industry: 'Logistics', country: 'Germany',
  },
  {
    id: 'CLT-006', name: 'Zenith Partners', email: 'billing@zenithpartners.com', phone: '+1 (555) 006-0006',
    totalRevenue: 14200, invoices: 4, paidInvoices: 2, avgDelayDays: 42, riskScore: 91, risk: 'high',
    lastPayment: '2023-09-18', industry: 'Consulting', country: 'France',
  },
  {
    id: 'CLT-007', name: 'Pinnacle Group', email: 'accounts@pinnaclegroup.net', phone: '+1 (555) 007-0007',
    totalRevenue: 31500, invoices: 8, paidInvoices: 8, avgDelayDays: 3, riskScore: 15, risk: 'low',
    lastPayment: '2024-01-28', industry: 'Manufacturing', country: 'United States',
  },
  {
    id: 'CLT-008', name: 'Vortex Tech', email: 'finance@vortextech.com', phone: '+1 (555) 008-0008',
    totalRevenue: 19700, invoices: 6, paidInvoices: 4, avgDelayDays: 22, riskScore: 64, risk: 'medium',
    lastPayment: '2023-12-01', industry: 'Technology', country: 'United States',
  },
];

export const payments = [
  { id: 'PAY-001', invoice: 'INV-2401', client: 'Apex Corp', amount: 8500, date: '2024-01-15', method: 'Bank Transfer', status: 'completed' },
  { id: 'PAY-002', invoice: 'INV-2404', client: 'Meridian Inc', amount: 15200, date: '2024-01-22', method: 'Credit Card', status: 'completed' },
  { id: 'PAY-003', invoice: 'INV-2407', client: 'Pinnacle Group', amount: 18700, date: '2024-01-28', method: 'Bank Transfer', status: 'completed' },
  { id: 'PAY-004', invoice: 'INV-2409', client: 'Horizon Labs', amount: 22000, date: '2024-02-01', method: 'Wire Transfer', status: 'completed' },
  { id: 'PAY-005', invoice: 'INV-2402', client: 'TechNova', amount: 12400, date: '2024-02-10', method: 'Credit Card', status: 'pending' },
  { id: 'PAY-006', invoice: 'INV-2405', client: 'Global Flex', amount: 9100, date: '2024-02-15', method: 'Bank Transfer', status: 'pending' },
];

export const expenses = [
  { id: 'EXP-001', description: 'AWS Server Costs', category: 'Software', amount: 2400, date: '2024-01-05', vendor: 'Amazon', status: 'approved' },
  { id: 'EXP-002', description: 'Office Rent', category: 'Operations', amount: 5500, date: '2024-01-01', vendor: 'Realty Group', status: 'approved' },
  { id: 'EXP-003', description: 'Google Ads Campaign', category: 'Marketing', amount: 3200, date: '2024-01-10', vendor: 'Google', status: 'approved' },
  { id: 'EXP-004', description: 'Team Salaries', category: 'Salaries', amount: 32000, date: '2024-01-31', vendor: 'Internal', status: 'approved' },
  { id: 'EXP-005', description: 'Flight to NY Conference', category: 'Travel', amount: 850, date: '2024-01-18', vendor: 'United Airlines', status: 'pending' },
  { id: 'EXP-006', description: 'Slack & Notion Subscriptions', category: 'Software', amount: 320, date: '2024-01-15', vendor: 'SaaS Tools', status: 'approved' },
  { id: 'EXP-007', description: 'Content Marketing Agency', category: 'Marketing', amount: 4800, date: '2024-01-20', vendor: 'ContentPro', status: 'approved' },
  { id: 'EXP-008', description: 'Internet & Utilities', category: 'Operations', amount: 680, date: '2024-01-07', vendor: 'Various', status: 'approved' },
];

export const reminders = [
  { id: 'REM-001', invoice: 'INV-2403', client: 'BlueStar LLC', amount: 6800, dueDate: '2024-01-20', daysOverdue: 14, status: 'sent', tone: 'firm', channel: 'email' },
  { id: 'REM-002', invoice: 'INV-2406', client: 'Zenith Partners', amount: 4300, dueDate: '2024-01-10', daysOverdue: 24, status: 'sent', tone: 'urgent', channel: 'email' },
  { id: 'REM-003', invoice: 'INV-2410', client: 'Crestwood Ltd', amount: 5500, dueDate: '2023-12-15', daysOverdue: 50, status: 'escalated', tone: 'urgent', channel: 'sms' },
  { id: 'REM-004', invoice: 'INV-2402', client: 'TechNova', amount: 12400, dueDate: '2024-02-18', daysOverdue: 0, status: 'scheduled', tone: 'friendly', channel: 'email' },
  { id: 'REM-005', invoice: 'INV-2408', client: 'Vortex Tech', amount: 7600, dueDate: '2024-03-01', daysOverdue: 0, status: 'scheduled', tone: 'friendly', channel: 'email' },
];

export const aiInsights = [
  {
    id: 1, type: 'warning', priority: 'high',
    title: 'Late Payment Risk Detected',
    description: 'BlueStar LLC has an 82% probability of defaulting on INV-2403 ($6,800). Historical pattern shows 35-day avg delay.',
    action: 'Send urgent reminder with 5% early payment discount',
    impact: '$6,800 at risk',
    client: 'BlueStar LLC',
  },
  {
    id: 2, type: 'insight', priority: 'medium',
    title: 'Revenue Concentration Risk',
    description: 'Top 3 clients (Apex Corp, TechNova, Pinnacle Group) generate 72% of your revenue. High dependency risk.',
    action: 'Diversify client portfolio — target 2 new enterprise clients',
    impact: 'Risk reduction',
    client: null,
  },
  {
    id: 3, type: 'opportunity', priority: 'medium',
    title: 'Best Sales Day: Friday',
    description: 'Analysis shows 34% higher invoice acceptance rate on Fridays. Optimize your outreach schedule.',
    action: 'Schedule proposal sends for Thursday evenings',
    impact: '+$8,200/month potential',
    client: null,
  },
  {
    id: 4, type: 'warning', priority: 'high',
    title: 'Zenith Partners — Escalation Required',
    description: 'INV-2406 is 24 days overdue ($4,300). Client has ignored 3 reminders. Risk score: 91/100.',
    action: 'Escalate to collections or offer payment plan',
    impact: '$4,300 at risk',
    client: 'Zenith Partners',
  },
  {
    id: 5, type: 'success', priority: 'low',
    title: 'Q4 Revenue Up 31%',
    description: 'October–December showed strongest growth quarter. Your best performing clients increased contract value.',
    action: 'Consider upsell offers to top 3 clients in Q1',
    impact: '+$28,000 opportunity',
    client: null,
  },
  {
    id: 6, type: 'insight', priority: 'medium',
    title: 'Late Payments Cost You 18% Revenue',
    description: 'Cash flow analysis shows delayed payments result in ~$14,200/month in opportunity cost.',
    action: 'Implement early payment incentive program (2% discount for 10-day payment)',
    impact: '$14,200/month recovered',
    client: null,
  },
];

export const dashboardStats = {
  totalRevenue: 196200,
  revenueGrowth: 23.4,
  pendingInvoices: 29100,
  pendingCount: 3,
  overdueInvoices: 16600,
  overdueCount: 3,
  totalClients: 8,
  activeClients: 6,
  cashBalance: 84300,
  cashGrowth: 12.1,
  avgPaymentDays: 18,
  collectionRate: 87,
};

export const recentActivity = [
  { id: 1, type: 'payment', message: 'Horizon Labs paid INV-2409', amount: '+$22,000', time: '2 hours ago', positive: true },
  { id: 2, type: 'invoice', message: 'New invoice INV-2410 created for Crestwood Ltd', amount: '$5,500', time: '4 hours ago', positive: null },
  { id: 3, type: 'alert', message: 'INV-2403 overdue — reminder sent to BlueStar LLC', amount: '$6,800', time: '6 hours ago', positive: false },
  { id: 4, type: 'payment', message: 'Pinnacle Group paid INV-2407', amount: '+$18,700', time: '1 day ago', positive: true },
  { id: 5, type: 'ai', message: 'AI flagged Zenith Partners as high risk', amount: '$4,300', time: '1 day ago', positive: false },
  { id: 6, type: 'invoice', message: 'INV-2408 created for Vortex Tech', amount: '$7,600', time: '2 days ago', positive: null },
];
