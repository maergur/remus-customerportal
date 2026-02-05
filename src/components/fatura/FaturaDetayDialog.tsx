import React, { useState, useRef, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import {
  invoiceMetadata,
  invoiceSummary,
  invoiceDailyData,
  getHeatmapData,
  getMetricRange,
  metricConfig,
  type HeatmapMetric,
} from "@/lib/invoiceDetailData";

// Parametric color function per metric
const getHeatmapColor = (value: number, min: number, max: number, metric: HeatmapMetric) => {
  const normalized = Math.min(1, Math.max(0, (value - min) / (max - min)));

  if (metric === "ptf") {
    // Green -> Yellow -> Red
    if (normalized < 0.5) {
      const r = Math.round(255 * (normalized * 2));
      const g = Math.round(200 + 55 * (normalized * 2));
      const b = Math.round(150 * (1 - normalized * 2));
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      const r = 255;
      const g = Math.round(255 * (1 - (normalized - 0.5) * 2));
      const b = Math.round(100 * (1 - (normalized - 0.5) * 2));
      return `rgb(${r}, ${g}, ${b})`;
    }
  } else if (metric === "consumption") {
    // Light Blue -> Blue -> Dark Blue
    const r = Math.round(180 * (1 - normalized));
    const g = Math.round(210 * (1 - normalized * 0.6));
    const b = Math.round(255 - normalized * 55);
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // Light Orange -> Orange -> Dark Red
    if (normalized < 0.5) {
      const r = Math.round(255);
      const g = Math.round(200 - normalized * 2 * 100);
      const b = Math.round(150 * (1 - normalized * 2));
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      const r = Math.round(255 - (normalized - 0.5) * 2 * 55);
      const g = Math.round(100 * (1 - (normalized - 0.5) * 2));
      const b = Math.round(20);
      return `rgb(${r}, ${g}, ${b})`;
    }
  }
};

const getTextColor = (value: number, min: number, max: number, metric: HeatmapMetric) => {
  const normalized = Math.min(1, Math.max(0, (value - min) / (max - min)));
  if (metric === "ptf") return normalized > 0.6 ? "white" : "black";
  if (metric === "consumption") return normalized > 0.4 ? "white" : "black";
  return normalized > 0.5 ? "white" : "black";
};

const getGradientColors = (metric: HeatmapMetric) => {
  if (metric === "ptf") return "linear-gradient(to right, rgb(100, 200, 150), rgb(255, 255, 100), rgb(255, 100, 100))";
  if (metric === "consumption") return "linear-gradient(to right, rgb(180, 210, 255), rgb(60, 130, 220), rgb(0, 84, 200))";
  return "linear-gradient(to right, rgb(255, 200, 150), rgb(255, 140, 50), rgb(200, 0, 20))";
};

// Gradient Range Slider (adapted from PtfTahminleme)
const GradientRangeSlider = ({
  value,
  onChange,
  min,
  max,
  metric,
}: {
  value: [number, number];
  onChange: (value: [number, number]) => void;
  min: number;
  max: number;
  metric: HeatmapMetric;
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<"left" | "right" | null>(null);

  const range = max - min;
  const step = metric === "ptf" ? 50 : metric === "consumption" ? 0.01 : 0.05;

  const getValueFromPosition = (clientX: number) => {
    if (!sliderRef.current) return min;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = x / rect.width;
    const raw = min + percent * range;
    return Math.round(raw / step) * step;
  };

  const handleMouseDown = (e: React.MouseEvent, thumb: "left" | "right") => {
    e.preventDefault();
    setDragging(thumb);
  };

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newValue = getValueFromPosition(e.clientX);
      if (dragging === "left") {
        onChange([Math.min(newValue, value[1] - step), value[1]]);
      } else {
        onChange([value[0], Math.max(newValue, value[0] + step)]);
      }
    };

    const handleMouseUp = () => setDragging(null);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, value, onChange]);

  const leftPercent = ((value[0] - min) / range) * 100;
  const rightPercent = ((value[1] - min) / range) * 100;

  const formatValue = (v: number) => {
    const cfg = metricConfig[metric];
    return cfg.decimals === 0 ? Math.round(v).toString() : v.toFixed(cfg.decimals);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground whitespace-nowrap">{formatValue(value[0])}</span>
      <div
        ref={sliderRef}
        className="relative h-3 w-28 rounded-full select-none"
        style={{ background: getGradientColors(metric) }}
      >
        <div
          className="absolute top-0 h-full rounded-l-full pointer-events-none"
          style={{ left: 0, width: `${leftPercent}%`, background: "rgba(255,255,255,0.7)" }}
        />
        <div
          className="absolute top-0 h-full rounded-r-full pointer-events-none"
          style={{ right: 0, width: `${100 - rightPercent}%`, background: "rgba(255,255,255,0.7)" }}
        />
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border border-gray-400 rounded-full shadow-sm cursor-grab active:cursor-grabbing hover:scale-110 transition-transform ${dragging === "left" ? "scale-110" : ""}`}
          style={{ left: `calc(${leftPercent}% - 7px)` }}
          onMouseDown={(e) => handleMouseDown(e, "left")}
        />
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border border-gray-400 rounded-full shadow-sm cursor-grab active:cursor-grabbing hover:scale-110 transition-transform ${dragging === "right" ? "scale-110" : ""}`}
          style={{ left: `calc(${rightPercent}% - 7px)` }}
          onMouseDown={(e) => handleMouseDown(e, "right")}
        />
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">{formatValue(value[1])}</span>
    </div>
  );
};

// Heatmap Grid (31 days x 24 hours)
const HeatmapGrid = ({
  data,
  valueRange,
  metric,
}: {
  data: { dateLabel: string; hours: number[] }[];
  valueRange: [number, number];
  metric: HeatmapMetric;
}) => {
  const [min, max] = getMetricRange(metric);
  const cfg = metricConfig[metric];

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[900px]">
        {/* Hour Headers */}
        <div className="grid grid-cols-[60px_repeat(24,1fr)] gap-px mb-1">
          <div className="text-[10px] text-muted-foreground"></div>
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} className="text-[10px] text-muted-foreground text-center">
              {i.toString().padStart(2, "0")}
            </div>
          ))}
        </div>

        {/* Data Rows */}
        {data.map((day, dayIndex) => (
          <div key={dayIndex} className="grid grid-cols-[60px_repeat(24,1fr)] gap-px mb-px">
            <div className="text-[10px] text-muted-foreground flex items-center pr-1">
              {day.dateLabel}
            </div>
            {day.hours.map((value, hourIndex) => {
              const isInRange = value >= valueRange[0] && value <= valueRange[1];
              return (
                <UITooltip key={hourIndex}>
                  <TooltipTrigger asChild>
                    <div
                      className="w-full h-8 flex items-center justify-center transition-opacity cursor-default text-[10px] leading-none font-semibold"
                      style={{
                        backgroundColor: getHeatmapColor(value, min, max, metric),
                        color: getTextColor(value, min, max, metric),
                        opacity: isInRange ? 1 : 0.15,
                      }}
                    >
                      {cfg.decimals === 0 ? Math.round(value) : value.toFixed(cfg.decimals)}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    <p className="font-medium">{day.dateLabel} - {hourIndex.toString().padStart(2, "0")}:00</p>
                    <p>{cfg.decimals === 0 ? Math.round(value) : value.toFixed(cfg.decimals)} {cfg.unit}</p>
                  </TooltipContent>
                </UITooltip>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

// Summary Card
const SummaryCard = ({ label, value, tooltip }: { label: string; value: string; tooltip?: string }) => (
  <div className="bg-secondary/50 rounded-xl p-3 border border-border">
    <div className="flex items-center gap-1 mb-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      {tooltip && (
        <UITooltip>
          <TooltipTrigger asChild>
            <button className="p-0.5 hover:bg-accent rounded-full transition-colors">
              <Info className="h-3 w-3 text-muted-foreground" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[200px]">
            <p className="text-xs">{tooltip}</p>
          </TooltipContent>
        </UITooltip>
      )}
    </div>
    <p className="text-sm font-semibold text-foreground">{value}</p>
  </div>
);

// Main Dialog Component
interface FaturaDetayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string;
  invoicePeriod: string;
}

const FaturaDetayDialog = ({ open, onOpenChange, invoiceId, invoicePeriod }: FaturaDetayDialogProps) => {
  const [activeMetric, setActiveMetric] = useState<HeatmapMetric>("ptf");

  const [ptfRange, setPtfRange] = useState<[number, number]>(() => getMetricRange("ptf"));
  const [consumptionRange, setConsumptionRange] = useState<[number, number]>(() => getMetricRange("consumption"));
  const [costRange, setCostRange] = useState<[number, number]>(() => getMetricRange("cost"));

  const rangeMap = {
    ptf: { value: ptfRange, onChange: setPtfRange },
    consumption: { value: consumptionRange, onChange: setConsumptionRange },
    cost: { value: costRange, onChange: setCostRange },
  };

  const heatmapData = useMemo(() => getHeatmapData(activeMetric), [activeMetric]);
  const [metricMin, metricMax] = useMemo(() => getMetricRange(activeMetric), [activeMetric]);

  const fmt = (n: number, d = 2) => n.toLocaleString("tr-TR", { minimumFractionDigits: d, maximumFractionDigits: d });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Fatura Detayı - {invoiceId} / {invoicePeriod}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Abonelik</p>
              <p className="text-sm font-medium text-foreground">{invoiceMetadata.abonelikAdi}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tesisat No</p>
              <p className="text-sm font-medium text-foreground">{invoiceMetadata.tesisatNo}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">YEKDEM Türü</p>
              <p className="text-sm font-medium text-foreground">{invoiceMetadata.yekdemTuru}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Dönem</p>
              <p className="text-sm font-medium text-foreground">{invoiceMetadata.donem}</p>
            </div>
          </div>

          {/* Context Cards + Formula Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-4">
            {/* Left: All summary cards */}
            <div className="grid grid-cols-2 gap-3 content-start">
              <SummaryCard
                label="Ağ. Ort. PTF"
                value={`${fmt(invoiceSummary.ptfAgirlikliOrtalama)} TL/MWh`}
                tooltip="Tüketim ağırlıklı ortalama PTF değeri"
              />
              <SummaryCard
                label="Toplam Tüketim"
                value={`${fmt(invoiceSummary.toplamTuketim)} kWh`}
                tooltip="Dönem içi toplam elektrik tüketimi"
              />
              <SummaryCard
                label="PTF Maliyet"
                value={`₺${fmt(invoiceSummary.ptfMaliyet)}`}
                tooltip="PTF bazlı enerji maliyeti"
              />
              <SummaryCard
                label="YEKDEM"
                value={`₺${fmt(invoiceSummary.yekdem)}`}
                tooltip="Yenilenebilir enerji destekleme mekanizması bedeli"
              />
              <SummaryCard
                label="Marj"
                value={`₺${fmt(invoiceSummary.marj)}`}
                tooltip="Tedarikçi marjı (%5 komisyon)"
              />
              <SummaryCard
                label="Toplam Enerji Maliyeti"
                value={`₺${fmt(invoiceSummary.toplamEnerjiMaliyeti)}`}
                tooltip="Fon, ek vergiler ve KDV dahil toplam maliyet"
              />
            </div>

            {/* Right: Formula breakdown */}
            {(() => {
              const araToplam = invoiceSummary.ptfMaliyet + invoiceSummary.yekdem;
              const afterMarj = araToplam + invoiceSummary.marj;
              const fonTutar = afterMarj * 0.05;
              const afterFon = afterMarj + fonTutar;
              const kdvTutar = afterFon * 0.20;

              return (
                <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-xs font-semibold text-foreground">Maliyet Hesaplaması</p>
                    <span className="text-[10px] text-muted-foreground bg-accent px-1.5 py-0.5 rounded-md font-mono">
                      (PTF + YEKDEM) × Marj
                    </span>
                  </div>
                  <div className="space-y-1 text-sm font-mono">
                    {/* PTF Maliyet */}
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-xs">PTF Maliyet</span>
                      <span className="text-foreground text-xs font-semibold">₺{fmt(invoiceSummary.ptfMaliyet)}</span>
                    </div>
                    {/* + YEKDEM */}
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-xs">
                        <span className="text-blue-500 font-bold mr-1">+</span>YEKDEM
                      </span>
                      <span className="text-foreground text-xs font-semibold">₺{fmt(invoiceSummary.yekdem)}</span>
                    </div>
                    {/* Divider */}
                    <div className="border-t border-border my-1" />
                    {/* Ara Toplam */}
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-xs">Ara Toplam</span>
                      <span className="text-foreground text-xs">₺{fmt(araToplam)}</span>
                    </div>
                    {/* + Marj */}
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-xs">
                        <span className="text-amber-500 font-bold mr-1">×</span>Marj ({invoiceMetadata.ptfKomisyonOran})
                      </span>
                      <span className="text-foreground text-xs font-semibold">₺{fmt(invoiceSummary.marj)}</span>
                    </div>
                    {/* + Fon & Vergiler */}
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-xs">
                        <span className="text-amber-500 font-bold mr-1">+</span>Fon & Ek Vergiler ({invoiceMetadata.fonVeEkVergilerOrani})
                      </span>
                      <span className="text-foreground text-xs font-semibold">₺{fmt(fonTutar)}</span>
                    </div>
                    {/* + KDV */}
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-xs">
                        <span className="text-amber-500 font-bold mr-1">+</span>KDV ({invoiceMetadata.kdvOrani})
                      </span>
                      <span className="text-foreground text-xs font-semibold">₺{fmt(kdvTutar)}</span>
                    </div>
                    {/* Double divider */}
                    <div className="border-t-2 border-foreground/20 my-1" />
                    {/* Toplam */}
                    <div className="flex justify-between items-center">
                      <span className="text-foreground text-xs font-bold">Toplam Enerji Maliyeti</span>
                      <span className="text-primary text-sm font-bold">₺{fmt(invoiceSummary.toplamEnerjiMaliyeti)}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Tabs with Heatmaps */}
          <Tabs
            value={activeMetric}
            onValueChange={(v) => setActiveMetric(v as HeatmapMetric)}
            className="w-full"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <TabsList>
                <TabsTrigger value="ptf">PTF</TabsTrigger>
                <TabsTrigger value="consumption">Tüketim</TabsTrigger>
                <TabsTrigger value="cost">Enerji Maliyeti</TabsTrigger>
              </TabsList>

              <GradientRangeSlider
                value={rangeMap[activeMetric].value}
                onChange={rangeMap[activeMetric].onChange}
                min={metricMin}
                max={metricMax}
                metric={activeMetric}
              />
            </div>

            <TabsContent value="ptf" className="mt-3">
              <div className="bg-card rounded-2xl p-4 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold text-foreground">PTF Isı Haritası (TL/MWh)</span>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <button className="p-1 hover:bg-accent rounded-full transition-colors">
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[250px]">
                      <p className="text-xs">Saatlik piyasa takas fiyatları. Yeşil düşük, kırmızı yüksek fiyatı temsil eder.</p>
                    </TooltipContent>
                  </UITooltip>
                </div>
                <HeatmapGrid data={heatmapData} valueRange={ptfRange} metric="ptf" />
              </div>
            </TabsContent>

            <TabsContent value="consumption" className="mt-3">
              <div className="bg-card rounded-2xl p-4 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold text-foreground">Tüketim Isı Haritası (kWh)</span>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <button className="p-1 hover:bg-accent rounded-full transition-colors">
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[250px]">
                      <p className="text-xs">Saatlik elektrik tüketimi. Açık mavi düşük, koyu mavi yüksek tüketimi gösterir.</p>
                    </TooltipContent>
                  </UITooltip>
                </div>
                <HeatmapGrid data={heatmapData} valueRange={consumptionRange} metric="consumption" />
              </div>
            </TabsContent>

            <TabsContent value="cost" className="mt-3">
              <div className="bg-card rounded-2xl p-4 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold text-foreground">Enerji Maliyeti Isı Haritası (TL)</span>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <button className="p-1 hover:bg-accent rounded-full transition-colors">
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[250px]">
                      <p className="text-xs">Saatlik toplam enerji maliyeti. Açık turuncu düşük, koyu kırmızı yüksek maliyeti gösterir.</p>
                    </TooltipContent>
                  </UITooltip>
                </div>
                <HeatmapGrid data={heatmapData} valueRange={costRange} metric="cost" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FaturaDetayDialog;
