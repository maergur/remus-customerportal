import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { FileText, Download, CreditCard, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const invoices = [
  { id: "FAT-2024-012", period: "Aralık 2024", amount: 342.50, status: "unpaid", dueDate: "25 Ara 2024" },
  { id: "FAT-2024-011", period: "Kasım 2024", amount: 298.75, status: "paid", paidDate: "22 Kas 2024" },
  { id: "FAT-2024-010", period: "Ekim 2024", amount: 265.00, status: "paid", paidDate: "20 Eki 2024" },
  { id: "FAT-2024-009", period: "Eylül 2024", amount: 245.25, status: "paid", paidDate: "22 Eyl 2024" },
  { id: "FAT-2024-008", period: "Ağustos 2024", amount: 312.00, status: "paid", paidDate: "21 Ağu 2024" },
  { id: "FAT-2024-007", period: "Temmuz 2024", amount: 285.50, status: "paid", paidDate: "23 Tem 2024" },
];

const Faturalar = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Faturalar & Ödemeler</h1>
            <p className="text-muted-foreground">Fatura geçmişinizi görüntüleyin ve ödemelerinizi yönetin</p>
          </div>
          <Button variant="default" size="lg" className="w-full sm:w-auto">
            <CreditCard className="h-5 w-5 mr-2" />
            Fatura Öde
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <span className="text-sm text-muted-foreground">Bekleyen Borç</span>
            </div>
            <p className="text-2xl font-bold text-foreground">₺342,50</p>
            <p className="text-xs text-red-500 mt-1">Son ödeme: 25 Ara 2024</p>
          </div>
          <div className="bg-card rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Ödenen (2024)</span>
            </div>
            <p className="text-2xl font-bold text-foreground">₺1,406,50</p>
            <p className="text-xs text-muted-foreground mt-1">5 fatura ödendi</p>
          </div>
          <div className="bg-card rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <span className="text-sm text-muted-foreground">Ortalama Fatura</span>
            </div>
            <p className="text-2xl font-bold text-foreground">₺291,50</p>
            <p className="text-xs text-muted-foreground mt-1">Son 6 ay ortalaması</p>
          </div>
        </div>

        {/* Invoice List - Mobile Cards */}
        <div className="lg:hidden space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Fatura Geçmişi</h3>
          {invoices.map((invoice) => (
            <div key={invoice.id} className="bg-card rounded-2xl p-4 border border-border">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{invoice.id}</p>
                    <p className="text-sm text-muted-foreground">{invoice.period}</p>
                  </div>
                </div>
                {invoice.status === "paid" ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    <CheckCircle className="h-3 w-3" /> Ödendi
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500">
                    <Clock className="h-3 w-3" /> Bekliyor
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-foreground">₺{invoice.amount.toFixed(2)}</p>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  PDF
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Invoice Table - Desktop */}
        <div className="hidden lg:block bg-card rounded-2xl border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Fatura Geçmişi</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Fatura No</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Dönem</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Tutar</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Durum</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Tarih</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium text-foreground">{invoice.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground">{invoice.period}</td>
                    <td className="px-6 py-4 font-semibold text-foreground">₺{invoice.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      {invoice.status === "paid" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          <CheckCircle className="h-3 w-3" /> Ödendi
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500">
                          <Clock className="h-3 w-3" /> Bekliyor
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {invoice.status === "paid" ? invoice.paidDate : invoice.dueDate}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Faturalar;
