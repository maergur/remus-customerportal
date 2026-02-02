import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TrendingUp, TrendingDown, Info, Download, Maximize2, Clock, Calendar, CalendarDays, Sparkles } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import React, { useState } from "react";

// Generate mock data for the current week (7 days)
const generateWeeklyHeatmapData = () => {
  const today = new Date();
  const data: { date: string; dateLabel: string; hours: number[] }[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: '2-digit' });

    // Generate 24 hourly values (PTF prices in TL/MWh)
    const hours = Array.from({ length: 24 }, (_, hour) => {
      // Simulate realistic PTF patterns: lower at night, higher during peak hours
      const basePrice = 2400;
      const nightDiscount = hour >= 0 && hour < 6 ? -600 : 0;
      const morningPeak = hour >= 7 && hour < 10 ? 400 : 0;
      const eveningPeak = hour >= 17 && hour < 21 ? 500 : 0;
      const randomVariation = Math.floor(Math.random() * 400) - 200;

      return Math.max(1000, basePrice + nightDiscount + morningPeak + eveningPeak + randomVariation);
    });

    data.push({ date: dateStr, dateLabel: dateStr, hours });
  }

  return data;
};

const weeklyHeatmapData = generateWeeklyHeatmapData();

// Calculate averages for metric cards
const allHourlyValues = weeklyHeatmapData.flatMap(d => d.hours);
const weeklyPTF = allHourlyValues.reduce((a, b) => a + b, 0) / allHourlyValues.length;

// Current hour PTF (latest day, current hour simulation)
const currentHour = new Date().getHours();
const todayData = weeklyHeatmapData[weeklyHeatmapData.length - 1];
const hourlyPTF = todayData ? todayData.hours[currentHour] : weeklyPTF;

// Monthly PTF average
const monthlyPTF = 2650; // Simulated monthly average

// Predicted PTF
const predictedPTF = weeklyPTF * 1.08;

// Trend calculations (simulated previous period comparisons)
const previousHourPTF = hourlyPTF * 1.03; // Previous hour was 3% higher
const previousWeekPTF = weeklyPTF * 1.05; // Previous week was 5% higher
const previousMonthPTF = monthlyPTF * 0.97; // Previous month was 3% lower

const hourlyTrend = ((hourlyPTF - previousHourPTF) / previousHourPTF) * 100;
const weeklyTrend = ((weeklyPTF - previousWeekPTF) / previousWeekPTF) * 100;
const monthlyTrend = ((monthlyPTF - previousMonthPTF) / previousMonthPTF) * 100;

// Insight message
const getInsightMessage = () => {
  if (weeklyTrend < -3) {
    return { text: "Bu hafta PTF ortalaması geçen haftaya göre düştü. Enerji maliyetleriniz azalabilir.", type: "positive" };
  } else if (weeklyTrend > 3) {
    return { text: "Bu hafta PTF ortalaması geçen haftaya göre yükseldi. Tüketim saatlerinizi optimize edin.", type: "warning" };
  }
  return { text: "PTF değerleri stabil seyrediyor. Normal tüketim planınıza devam edebilirsiniz.", type: "neutral" };
};

const insight = getInsightMessage();

// Generate hourly average data (across all 7 days)
const hourlyAverageData = Array.from({ length: 24 }, (_, hour) => {
  const hourValues = weeklyHeatmapData.map(d => d.hours[hour]);
  const avgPTF = hourValues.reduce((a, b) => a + b, 0) / hourValues.length;
  return {
    hour: `${hour.toString().padStart(2, '0')}:00`,
    ptf: Math.round(avgPTF),
    aoptf: Math.round(avgPTF * 1.02),
  };
});

// Generate daily average data
const dailyAverageData = weeklyHeatmapData.map(d => {
  const avgPTF = d.hours.reduce((a, b) => a + b, 0) / d.hours.length;
  return {
    date: d.dateLabel,
    ptf: Math.round(avgPTF),
    aoptf: Math.round(avgPTF * 1.02),
  };
});

// Generate monthly average data (last 12 months + current)
const monthNames = ['Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara', 'Oca', 'Şub'];
const monthlyAverageData = monthNames.map((month, index) => {
  // Simulate seasonal patterns: higher in summer, lower in spring
  const basePrice = 2400;
  const seasonalVariation = index >= 4 && index <= 8 ? 400 : (index >= 9 || index <= 2 ? 200 : 0);
  const randomVariation = Math.floor(Math.random() * 200) - 100;
  const ptf = basePrice + seasonalVariation + randomVariation;

  return {
    month: month,
    ptf: Math.round(ptf),
    aoptf: Math.round(ptf * 1.02),
  };
});

// Color scale for heatmap (green -> yellow -> red)
const getHeatmapColor = (value: number) => {
  const min = 1000;
  const max = 3400;
  const normalized = Math.min(1, Math.max(0, (value - min) / (max - min)));

  if (normalized < 0.5) {
    // Green to Yellow
    const r = Math.round(255 * (normalized * 2));
    const g = Math.round(200 + 55 * (normalized * 2));
    const b = Math.round(150 * (1 - normalized * 2));
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // Yellow to Red
    const r = 255;
    const g = Math.round(255 * (1 - (normalized - 0.5) * 2));
    const b = Math.round(100 * (1 - (normalized - 0.5) * 2));
    return `rgb(${r}, ${g}, ${b})`;
  }
};

const MetricCard = ({
  title,
  subtitle,
  value,
  unit,
  trend,
  icon: Icon,
  tooltip
}: {
  title: string;
  subtitle: string;
  value: string;
  unit: string;
  trend?: { value: string; isPositive: boolean };
  icon?: React.ElementType;
  tooltip?: string;
}) => (
  <div className="bg-card rounded-2xl p-4 lg:p-5 border border-border relative">
    <div className="absolute top-4 right-4">
      <UITooltip>
        <TooltipTrigger asChild>
          <button className="p-1 hover:bg-accent rounded-full transition-colors">
            <Info className="h-4 w-4 text-muted-foreground" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[200px]">
          <p className="text-xs">{tooltip || "Piyasa Takas Fiyatı (PTF) - EPIAS tarafından belirlenen elektrik fiyatı"}</p>
        </TooltipContent>
      </UITooltip>
    </div>
    <div className="flex items-center gap-2 lg:gap-4 mb-4">
      {Icon && (
        <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-xl lg:text-2xl font-bold text-foreground">{value}</span>
      <span className="text-xs text-muted-foreground">{unit}</span>
    </div>
    {trend && (
      <p className={`text-xs flex items-center gap-1 mt-1 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {trend.value}
      </p>
    )}
  </div>
);

const HeatmapGrid = ({
  data,
  priceRange,
  showValues = true
}: {
  data: typeof weeklyHeatmapData;
  priceRange: [number, number];
  showValues?: boolean;
}) => (
  <div className="overflow-x-auto">
    <div className="min-w-[900px]">
      {/* Hour Headers */}
      <div className="grid grid-cols-[80px_repeat(24,1fr)] gap-px mb-1">
        <div className="text-xs text-muted-foreground"></div>
        {Array.from({ length: 24 }, (_, i) => (
          <div key={i} className="text-xs text-muted-foreground text-center">
            {i.toString().padStart(2, '0')}:00
          </div>
        ))}
      </div>

      {/* Data Rows */}
      {data.map((day, dayIndex) => (
        <div key={dayIndex} className="grid grid-cols-[80px_repeat(24,1fr)] gap-px mb-px">
          <div className="text-xs text-muted-foreground flex items-center pr-2">
            {day.dateLabel}
          </div>
          {day.hours.map((value, hourIndex) => {
            const isInRange = value >= priceRange[0] && value <= priceRange[1];
            return (
              <div
                key={hourIndex}
                className="w-full h-8 flex items-center justify-center text-xs font-medium transition-opacity"
                style={{
                  backgroundColor: getHeatmapColor(value),
                  color: value > 2800 ? 'white' : 'black',
                  opacity: isInRange ? 1 : 0.15
                }}
              >
                {showValues && value}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  </div>
);

// Gradient Range Slider Component
const GradientRangeSlider = ({
  value,
  onChange,
  min = 1000,
  max = 3400
}: {
  value: [number, number];
  onChange: (value: [number, number]) => void;
  min?: number;
  max?: number;
}) => {
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<'left' | 'right' | null>(null);

  const range = max - min;

  const getValueFromPosition = (clientX: number) => {
    if (!sliderRef.current) return min;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = x / rect.width;
    return Math.round(min + percent * range);
  };

  const handleMouseDown = (e: React.MouseEvent, thumb: 'left' | 'right') => {
    e.preventDefault();
    setDragging(thumb);
  };

  React.useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newValue = getValueFromPosition(e.clientX);
      if (dragging === 'left') {
        onChange([Math.min(newValue, value[1] - 50), value[1]]);
      } else {
        onChange([value[0], Math.max(newValue, value[0] + 50)]);
      }
    };

    const handleMouseUp = () => {
      setDragging(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, value, onChange]);

  const leftPercent = ((value[0] - min) / range) * 100;
  const rightPercent = ((value[1] - min) / range) * 100;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">{value[0]}</span>
      <div
        ref={sliderRef}
        className="relative h-3 w-28 rounded-full select-none"
        style={{ background: 'linear-gradient(to right, rgb(100, 200, 150), rgb(255, 255, 100), rgb(255, 100, 100))' }}
      >
        {/* Left fade overlay */}
        <div
          className="absolute top-0 h-full rounded-l-full pointer-events-none"
          style={{
            left: 0,
            width: `${leftPercent}%`,
            background: 'rgba(255,255,255,0.7)'
          }}
        />
        {/* Right fade overlay */}
        <div
          className="absolute top-0 h-full rounded-r-full pointer-events-none"
          style={{
            right: 0,
            width: `${100 - rightPercent}%`,
            background: 'rgba(255,255,255,0.7)'
          }}
        />
        {/* Left thumb */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border border-gray-400 rounded-full shadow-sm cursor-grab active:cursor-grabbing hover:scale-110 transition-transform ${dragging === 'left' ? 'scale-110' : ''}`}
          style={{ left: `calc(${leftPercent}% - 7px)` }}
          onMouseDown={(e) => handleMouseDown(e, 'left')}
        />
        {/* Right thumb */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border border-gray-400 rounded-full shadow-sm cursor-grab active:cursor-grabbing hover:scale-110 transition-transform ${dragging === 'right' ? 'scale-110' : ''}`}
          style={{ left: `calc(${rightPercent}% - 7px)` }}
          onMouseDown={(e) => handleMouseDown(e, 'right')}
        />
      </div>
      <span className="text-xs text-muted-foreground">{value[1]}</span>
    </div>
  );
};

const PtfTahminleme = () => {
  const [showPredictions, setShowPredictions] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([1000, 3400]);
  const [isExpandedOpen, setIsExpandedOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tahminleme</h1>
          <p className="text-muted-foreground">Piyasa takas fiyatı analizi ve tahminleri</p>
        </div>

        {/* Insight Banner */}
        <div className={`rounded-lg px-3 py-2 flex items-center gap-2 ${
          insight.type === 'positive' ? 'bg-green-500/10 border border-green-500/20' :
          insight.type === 'warning' ? 'bg-amber-500/10 border border-amber-500/20' :
          'bg-blue-500/10 border border-blue-500/20'
        }`}>
          <Sparkles className={`h-4 w-4 flex-shrink-0 ${
            insight.type === 'positive' ? 'text-green-500' :
            insight.type === 'warning' ? 'text-amber-500' :
            'text-blue-500'
          }`} />
          <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Haftalık Özet:</span> {insight.text}</p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Anlık PTF"
            subtitle="Bu saat"
            value={hourlyPTF.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            unit="TL/MWh"
            icon={Clock}
            tooltip="Şu anki saatin piyasa takas fiyatı"
            trend={{ value: `${Math.abs(hourlyTrend).toFixed(1)}% önceki saate göre`, isPositive: hourlyTrend < 0 }}
          />
          <MetricCard
            title="Haftalık PTF"
            subtitle="7 gün ortalaması"
            value={weeklyPTF.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            unit="TL/MWh"
            icon={Calendar}
            tooltip="Son 7 günün ortalama piyasa takas fiyatı"
            trend={{ value: `${Math.abs(weeklyTrend).toFixed(1)}% geçen haftaya göre`, isPositive: weeklyTrend < 0 }}
          />
          <MetricCard
            title="Aylık PTF"
            subtitle="30 gün ortalaması"
            value={monthlyPTF.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            unit="TL/MWh"
            icon={CalendarDays}
            tooltip="Son 30 günün ortalama piyasa takas fiyatı"
            trend={{ value: `${Math.abs(monthlyTrend).toFixed(1)}% geçen aya göre`, isPositive: monthlyTrend < 0 }}
          />
          <MetricCard
            title="Tahmini PTF"
            subtitle="Gelecek hafta"
            value={predictedPTF.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            unit="TL/MWh"
            icon={TrendingUp}
            tooltip="Makine öğrenmesi ile tahmin edilen gelecek hafta ortalaması"
          />
        </div>

        {/* Expanded Dialog */}
        <Dialog open={isExpandedOpen} onOpenChange={setIsExpandedOpen}>
          <DialogContent className="max-w-[95vw] w-full max-h-[95vh] overflow-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">PTF Tahminleme - Haftalık Görünüm</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {/* Price Range Slider in Dialog */}
              <div className="mb-4">
                <GradientRangeSlider value={priceRange} onChange={setPriceRange} />
              </div>
              <HeatmapGrid data={weeklyHeatmapData} priceRange={priceRange} />
            </div>
          </DialogContent>
        </Dialog>

        {/* Single Tab Interface */}
        <Tabs defaultValue="heatmap" className="w-full">
          <TabsList>
            <TabsTrigger value="heatmap">Haftalık Isı Haritası</TabsTrigger>
            <TabsTrigger value="hourly">Saatlik Trend</TabsTrigger>
            <TabsTrigger value="daily">Günlük Trend</TabsTrigger>
            <TabsTrigger value="monthly">Aylık Trend</TabsTrigger>
          </TabsList>

          {/* Heatmap Tab */}
          <TabsContent value="heatmap">
            <div className="bg-card rounded-2xl p-4 lg:p-6 border border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-foreground">Haftalık PTF Isı Haritası</span>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <button className="p-1 hover:bg-accent rounded-full transition-colors">
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[250px]">
                      <p className="text-xs">Her hücre bir saatin PTF değerini gösterir. Yeşil düşük, kırmızı yüksek fiyatı temsil eder.</p>
                    </TooltipContent>
                  </UITooltip>
                  <Switch
                    checked={showPredictions}
                    onCheckedChange={setShowPredictions}
                  />
                </div>
                <div className="flex items-center gap-6">
                  {/* Gradient Range Slider */}
                  <GradientRangeSlider value={priceRange} onChange={setPriceRange} />

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                      <Download className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button
                      className="p-2 hover:bg-accent rounded-lg transition-colors"
                      onClick={() => setIsExpandedOpen(true)}
                    >
                      <Maximize2 className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Heatmap Grid */}
              <HeatmapGrid data={weeklyHeatmapData} priceRange={priceRange} />
            </div>
          </TabsContent>

          {/* Hourly PTF Tab */}
          <TabsContent value="hourly">
            <div className="bg-card rounded-2xl p-4 lg:p-6 border border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-foreground">Saatlik PTF Trendi</span>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <button className="p-1 hover:bg-accent rounded-full transition-colors">
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[250px]">
                      <p className="text-xs">Günün her saati için ortalama PTF değerleri. Düşük fiyatlı saatlerde tüketim yaparak tasarruf edebilirsiniz.</p>
                    </TooltipContent>
                  </UITooltip>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-muted-foreground">PTF (TL/MWh)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-purple-500" />
                      <span className="text-muted-foreground">AOPTF (TL/MWh)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                      <Download className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                      <Maximize2 className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="h-72 lg:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourlyAverageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="hour"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      tickFormatter={(value) => value.replace(':00', '')}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      domain={[0, 4000]}
                      tickFormatter={(value) => `${value}`}
                      label={{ value: 'TL/MWh', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))', fontSize: 11 } }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        color: 'hsl(var(--foreground))'
                      }}
                      formatter={(value: number, name: string) => [
                        `${value.toLocaleString('tr-TR')} TL/MWh`,
                        name === 'ptf' ? 'PTF' : 'AOPTF'
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="ptf"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="aoptf"
                      stroke="#a855f7"
                      strokeWidth={2}
                      dot={{ fill: '#a855f7', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          {/* Daily PTF Tab */}
          <TabsContent value="daily">
            <div className="bg-card rounded-2xl p-4 lg:p-6 border border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-foreground">Günlük PTF Trendi</span>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <button className="p-1 hover:bg-accent rounded-full transition-colors">
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[250px]">
                      <p className="text-xs">Son 7 günün günlük ortalama PTF değerleri. Hafta içi ve hafta sonu farkını gözlemleyin.</p>
                    </TooltipContent>
                  </UITooltip>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-muted-foreground">PTF (TL/MWh)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-purple-500" />
                      <span className="text-muted-foreground">AOPTF (TL/MWh)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                      <Download className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                      <Maximize2 className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="h-72 lg:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyAverageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      domain={[0, 3500]}
                      tickFormatter={(value) => `${value}`}
                      label={{ value: 'TL/MWh', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))', fontSize: 11 } }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        color: 'hsl(var(--foreground))'
                      }}
                      formatter={(value: number, name: string) => [
                        `${value.toLocaleString('tr-TR')} TL/MWh`,
                        name === 'ptf' ? 'PTF' : 'AOPTF'
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="ptf"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="aoptf"
                      stroke="#a855f7"
                      strokeWidth={2}
                      dot={{ fill: '#a855f7', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          {/* Monthly PTF Tab */}
          <TabsContent value="monthly">
            <div className="bg-card rounded-2xl p-4 lg:p-6 border border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-foreground">Aylık PTF Trendi</span>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <button className="p-1 hover:bg-accent rounded-full transition-colors">
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[250px]">
                      <p className="text-xs">Son 13 ayın ortalama PTF değerleri. Mevsimsel dalgalanmaları ve uzun vadeli trendleri takip edin.</p>
                    </TooltipContent>
                  </UITooltip>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-muted-foreground">PTF (TL/MWh)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-purple-500" />
                      <span className="text-muted-foreground">AOPTF (TL/MWh)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                      <Download className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                      <Maximize2 className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="h-72 lg:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyAverageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      domain={[0, 3500]}
                      tickFormatter={(value) => `${value}`}
                      label={{ value: 'TL/MWh', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))', fontSize: 11 } }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        color: 'hsl(var(--foreground))'
                      }}
                      formatter={(value: number, name: string) => [
                        `${value.toLocaleString('tr-TR')} TL/MWh`,
                        name === 'ptf' ? 'PTF' : 'AOPTF'
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="ptf"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="aoptf"
                      stroke="#a855f7"
                      strokeWidth={2}
                      dot={{ fill: '#a855f7', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PtfTahminleme;
