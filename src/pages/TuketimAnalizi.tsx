import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { BarChart3, TrendingUp, TrendingDown, Zap, Calendar } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const monthlyData = [
  { name: "Oca", tuketim: 320, isForecast: false },
  { name: "Şub", tuketim: 280, isForecast: false },
  { name: "Mar", tuketim: 245, isForecast: false },
  { name: "Nis", tuketim: 190, isForecast: false },
  { name: "May", tuketim: 165, isForecast: false },
  { name: "Haz", tuketim: 210, isForecast: false },
  { name: "Tem", tuketim: 285, isForecast: false },
  { name: "Ağu", tuketim: 310, isForecast: false },
  { name: "Eyl", tuketim: 245, isForecast: false },
  { name: "Eki", tuketim: 220, isForecast: false },
  { name: "Kas", tuketim: 290, isForecast: false },
  { name: "Ara", tuketim: 245, isForecast: false },
];

// Current month index (0-based, December = 11)
const currentMonthIndex = 11; // Aralık

// Create data with actual and forecast values
const chartData = monthlyData.map((item, index) => ({
  name: item.name,
  actual: index <= currentMonthIndex ? item.tuketim : null,
  forecast: index >= currentMonthIndex ? (index === currentMonthIndex ? item.tuketim : Math.round(item.tuketim * (0.9 + Math.random() * 0.2))) : null,
}));

// Add forecast months for next year
const forecastMonths = [
  { name: "Oca'27", forecast: 335 },
  { name: "Şub'27", forecast: 295 },
  { name: "Mar'27", forecast: 260 },
];

const fullChartData = [...chartData, ...forecastMonths.map(m => ({ name: m.name, actual: null, forecast: m.forecast }))];

const TuketimAnalizi = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tüketim Analizi</h1>
          <p className="text-muted-foreground">Enerji tüketiminizi detaylı olarak inceleyin</p>
        </div>

        {/* Stats Cards - 3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
              </div>
              <span className="text-xs lg:text-sm text-muted-foreground">Bu Ay Tahmini</span>
            </div>
            <p className="text-xl lg:text-2xl font-bold text-foreground">265 kWh</p>
            <p className="text-xs text-primary flex items-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3" /> %5 azalma bekleniyor
            </p>
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
        </div>

        {/* Monthly Chart with Forecast - Full width */}
        <div className="bg-card rounded-2xl p-4 lg:p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Aylık Tüketim & Tahmin</h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Gerçekleşen</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-muted-foreground">Tahmin</span>
              </div>
            </div>
          </div>
          <div className="h-72 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fullChartData}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    color: 'hsl(var(--foreground))'
                  }}
                  formatter={(value: number, name: string) => [
                    `${value} kWh`,
                    name === 'actual' ? 'Gerçekleşen' : 'Tahmin'
                  ]}
                />
                <ReferenceLine x="Ara" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" label={{ value: 'Bugün', position: 'top', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <Area 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1} 
                  fill="url(#colorActual)" 
                  strokeWidth={2}
                  connectNulls={false}
                />
                <Area 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="hsl(38, 92%, 50%)" 
                  fillOpacity={1} 
                  fill="url(#colorForecast)" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  connectNulls={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default TuketimAnalizi;
