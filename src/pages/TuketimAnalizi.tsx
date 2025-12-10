import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { BarChart3, TrendingUp, TrendingDown, Zap } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const monthlyData = [
  { name: "Oca", tuketim: 320 },
  { name: "Şub", tuketim: 280 },
  { name: "Mar", tuketim: 245 },
  { name: "Nis", tuketim: 190 },
  { name: "May", tuketim: 165 },
  { name: "Haz", tuketim: 210 },
  { name: "Tem", tuketim: 285 },
  { name: "Ağu", tuketim: 310 },
  { name: "Eyl", tuketim: 245 },
  { name: "Eki", tuketim: 220 },
  { name: "Kas", tuketim: 290 },
  { name: "Ara", tuketim: 340 },
];

const dailyData = [
  { name: "Pzt", tuketim: 12 },
  { name: "Sal", tuketim: 15 },
  { name: "Çar", tuketim: 10 },
  { name: "Per", tuketim: 18 },
  { name: "Cum", tuketim: 14 },
  { name: "Cmt", tuketim: 22 },
  { name: "Paz", tuketim: 20 },
];

const TuketimAnalizi = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tüketim Analizi</h1>
          <p className="text-muted-foreground">Enerji tüketiminizi detaylı olarak inceleyin</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-2xl p-4 lg:p-5 border border-border">
            <div className="flex items-center gap-2 lg:gap-3 mb-3">
              <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
              </div>
              <span className="text-xs lg:text-sm text-muted-foreground">Bu Ay</span>
            </div>
            <p className="text-xl lg:text-2xl font-bold text-foreground">245 kWh</p>
            <p className="text-xs text-primary flex items-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3" /> %12 azaldı
            </p>
          </div>
          <div className="bg-card rounded-2xl p-4 lg:p-5 border border-border">
            <div className="flex items-center gap-2 lg:gap-3 mb-3">
              <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <BarChart3 className="h-4 w-4 lg:h-5 lg:w-5 text-blue-500" />
              </div>
              <span className="text-xs lg:text-sm text-muted-foreground">Geçen Ay</span>
            </div>
            <p className="text-xl lg:text-2xl font-bold text-foreground">278 kWh</p>
            <p className="text-xs text-muted-foreground mt-1">Kasım 2026</p>
          </div>
          <div className="bg-card rounded-2xl p-4 lg:p-5 border border-border">
            <div className="flex items-center gap-2 lg:gap-3 mb-3">
              <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5 text-orange-500" />
              </div>
              <span className="text-xs lg:text-sm text-muted-foreground">Yıllık</span>
            </div>
            <p className="text-xl lg:text-2xl font-bold text-foreground">3,100 kWh</p>
            <p className="text-xs text-muted-foreground mt-1">2026 yılı</p>
          </div>
          <div className="bg-card rounded-2xl p-4 lg:p-5 border border-border">
            <div className="flex items-center gap-2 lg:gap-3 mb-3">
              <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Zap className="h-4 w-4 lg:h-5 lg:w-5 text-purple-500" />
              </div>
              <span className="text-xs lg:text-sm text-muted-foreground">Ortalama</span>
            </div>
            <p className="text-xl lg:text-2xl font-bold text-foreground">258 kWh</p>
            <p className="text-xs text-muted-foreground mt-1">Aylık ortalama</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-2xl p-4 lg:p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Aylık Tüketim</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorTuketim" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                  <XAxis dataKey="name" stroke="hsl(215, 16%, 47%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 16%, 47%)" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(0, 0%, 100%)', 
                      border: '1px solid hsl(214, 32%, 91%)',
                      borderRadius: '12px'
                    }} 
                  />
                  <Area type="monotone" dataKey="tuketim" stroke="hsl(142, 71%, 45%)" fillOpacity={1} fill="url(#colorTuketim)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-4 lg:p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Haftalık Tüketim</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                  <XAxis dataKey="name" stroke="hsl(215, 16%, 47%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 16%, 47%)" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(0, 0%, 100%)', 
                      border: '1px solid hsl(214, 32%, 91%)',
                      borderRadius: '12px'
                    }} 
                  />
                  <Bar dataKey="tuketim" fill="hsl(142, 71%, 45%)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-primary/5 rounded-2xl p-4 lg:p-6 border border-primary/20">
          <h3 className="text-lg font-semibold text-foreground mb-2">💡 Tasarruf İpucu</h3>
          <p className="text-muted-foreground text-sm lg:text-base">
            Hafta sonları tüketiminiz hafta içine göre %40 daha yüksek. Enerji tasarrufu için cihazlarınızı kullanmadığınız zamanlarda kapalı tutmayı deneyin.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TuketimAnalizi;
