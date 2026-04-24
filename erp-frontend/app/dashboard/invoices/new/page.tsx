"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
  Send,
  Save,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
  File,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LineItem {
  id: number;
  description: string;
  quantity: number;
  rate: number;
}

interface Attachment {
  id: number;
  name: string;
  size: string;
  type: "pdf" | "image" | "other";
}

import { clientsApi, invoicesApi } from "@/lib/api";
import { useEffect } from "react";


const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar", rate: 1 },
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79 },
  { code: "RWF", symbol: "FRw", name: "Rwandan Franc", rate: 1285 },
  { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
];

const paymentTerms = [
  { value: "due_on_receipt", label: "Due on Receipt" },
  { value: "net_7", label: "Net 7 Days" },
  { value: "net_14", label: "Net 14 Days" },
  { value: "net_30", label: "Net 30 Days" },
  { value: "net_60", label: "Net 60 Days" },
  { value: "custom", label: "Custom Date" },
];

export default function NewInvoicePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAction, setSubmitAction] = useState<"draft" | "send" | null>(null);
  const [currency, setCurrency] = useState("USD");
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    clientsApi.getAll().then(setClients).catch(console.error);
  }, []);
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: 1, description: "", quantity: 1, rate: 0 },
  ]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [formData, setFormData] = useState({
    clientId: "",
    invoiceNumber: `INV-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    paymentTerms: "net_14",
    notes: "",
    taxRate: 0,
    sendReminders: true,
  });

  const currentCurrency = currencies.find((c) => c.code === currency) || currencies[0];

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: Date.now(), description: "", quantity: 1, rate: 0 },
    ]);
  };

  const removeLineItem = (id: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id));
    }
  };

  const updateLineItem = (id: number, field: keyof LineItem, value: string | number) => {
    setLineItems(
      lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addAttachment = () => {
    // Simulate file upload
    const mockFiles: Attachment[] = [
      { id: Date.now(), name: "contract.pdf", size: "2.4 MB", type: "pdf" },
      { id: Date.now() + 1, name: "product-photo.jpg", size: "1.2 MB", type: "image" },
    ];
    const randomFile = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    setAttachments([...attachments, { ...randomFile, id: Date.now() }]);
  };

  const removeAttachment = (id: number) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  const subtotal = lineItems.reduce(
    (acc, item) => acc + item.quantity * item.rate,
    0
  );
  const tax = subtotal * (formData.taxRate / 100);
  const total = subtotal + tax;

  // Convert to other currencies
  const convertedAmounts = useMemo(() => {
    return currencies
      .filter((c) => c.code !== currency)
      .map((c) => ({
        code: c.code,
        symbol: c.symbol,
        amount: total * (c.rate / currentCurrency.rate),
      }));
  }, [total, currency, currentCurrency.rate]);

  const handleSubmit = async (e: React.FormEvent, action: "draft" | "send") => {
    e.preventDefault();
    setIsSubmitting(true);
    await invoicesApi.create({
      client: { id: parseInt(formData.clientId), name: "", email: "" },
      amount: total,
      status: action === "send" ? "pending" : "draft",
      issueDate: formData.issueDate,
      dueDate: formData.dueDate || formData.issueDate,
    });
    setIsSubmitting(false);
    setSubmitAction(null);
    router.push("/dashboard/invoices");
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />;
      case "image":
        return <ImageIcon className="h-4 w-4 text-blue-500" />;
      default:
        return <File className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/invoices">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Invoice</h1>
            <p className="text-muted-foreground">
              Fill in the details to create a new invoice
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-sm font-mono">
          {formData.invoiceNumber}
        </Badge>
      </div>

      <form className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Details */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
              <CardDescription>
                Basic information about the invoice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Input
                    id="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, invoiceNumber: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Client</Label>
                  <Select
                    value={formData.clientId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, clientId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id.toString()}>
                          <div className="flex flex-col">
                            <span>{client.name}</span>
                            <span className="text-xs text-muted-foreground">{client.email}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-medium">{c.symbol}</span>
                            <span>{c.code}</span>
                            <span className="text-xs text-muted-foreground">- {c.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, issueDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">Payment Terms</Label>
                  <Select
                    value={formData.paymentTerms}
                    onValueChange={(value) =>
                      setFormData({ ...formData, paymentTerms: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentTerms.map((term) => (
                        <SelectItem key={term.value} value={term.value}>
                          {term.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {formData.paymentTerms === "custom" && (
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
              <CardDescription>Add products or services to the invoice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
                <div className="col-span-5">Description</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-2">Rate ({currentCurrency.symbol})</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-1"></div>
              </div>

              {/* Items */}
              {lineItems.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-5">
                    <Input
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) =>
                        updateLineItem(item.id, "description", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateLineItem(item.id, "quantity", parseInt(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) =>
                        updateLineItem(item.id, "rate", parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div className="col-span-2 text-right font-medium">
                    {currentCurrency.symbol}
                    {(item.quantity * item.rate).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLineItem(item.id)}
                      disabled={lineItems.length === 1}
                      className="hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addLineItem}
                className="w-full gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Line Item
              </Button>
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
              <CardDescription>
                Add contracts, receipts, or other supporting documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between rounded-lg border p-3 bg-muted/30"
                    >
                      <div className="flex items-center gap-3">
                        {getAttachmentIcon(attachment.type)}
                        <div>
                          <p className="text-sm font-medium">{attachment.name}</p>
                          <p className="text-xs text-muted-foreground">{attachment.size}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAttachment(attachment.id)}
                        className="h-8 w-8 hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={addAttachment}
                className="w-full gap-2"
              >
                <Paperclip className="h-4 w-4" />
                Add Attachment
              </Button>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
              <CardDescription>
                Add any notes or terms for this invoice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Payment is due within 14 days. Please include invoice number in payment reference..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Invoice Summary</CardTitle>
              <CardDescription>
                <span className="font-mono">{currency}</span> - {currentCurrency.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>
                    {currentCurrency.symbol}
                    {subtotal.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tax Rate</span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.taxRate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          taxRate: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-20 text-right h-8"
                    />
                    <span>%</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax Amount</span>
                  <span>
                    {currentCurrency.symbol}
                    {tax.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold text-xl">
                  <span>Total</span>
                  <span>
                    {currentCurrency.symbol}
                    {total.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              {/* Currency Conversion */}
              {total > 0 && (
                <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <RefreshCw className="h-3 w-3" />
                      Exchange Rates
                    </span>
                    <span>Live rates</span>
                  </div>
                  {convertedAmounts.map((converted) => (
                    <div key={converted.code} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{converted.code}</span>
                      <span className="font-mono">
                        {converted.symbol}
                        {converted.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Reminder Option */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  id="reminders"
                  type="checkbox"
                  checked={formData.sendReminders}
                  onChange={(e) =>
                    setFormData({ ...formData, sendReminders: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-border bg-background"
                />
                <label htmlFor="reminders" className="text-sm text-muted-foreground">
                  Send automatic payment reminders
                </label>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Button
                  className="w-full gap-2"
                  onClick={(e) => handleSubmit(e, "send")}
                  disabled={isSubmitting}
                >
                  {isSubmitting && submitAction === "send" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Create & Send Invoice
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={(e) => handleSubmit(e, "draft")}
                  disabled={isSubmitting}
                >
                  {isSubmitting && submitAction === "draft" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save as Draft
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
