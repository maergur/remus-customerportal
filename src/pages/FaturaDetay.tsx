import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, ChevronDown, Info } from "lucide-react";
import {
  invoiceMetadata,
  invoiceSummary,
  getHeatmapData,
  getMetricRange,
  metricConfig,
  type HeatmapMetric,
} from "@/lib/invoiceDetailData";

// Parametric color function per metric
const getHeatmapColor = (value: number, min: number, max: number, metric: HeatmapMetric) => {
  const normalized = Math.min(1, Math.max(0, (value - min) / (max - min)));

  if (metric === "ptf") {
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
    const r = Math.round(180 * (1 - normalized));
    const g = Math.round(210 * (1 - normalized * 0.6));
    const b = Math.round(255 - normalized * 55);
    return `rgb(${r}, ${g}, ${b})`;
  } else {
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

// Gradient Range Slider
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

const KeyValueRow = ({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) => (
  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-0.5">
    <span className={`text-sm truncate ${emphasis ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
      {label}
    </span>
    <span
      className={`text-sm font-mono tabular-nums whitespace-nowrap text-right ${
        emphasis ? "text-foreground font-bold" : "text-foreground font-medium"
      }`}
    >
      {value}
    </span>
  </div>
);

const FaturaDetay = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get("id") || "FAT-2024-012";
  const invoicePeriod = searchParams.get("period") || "Ocak 2026";

  const [activeMetric, setActiveMetric] = useState<HeatmapMetric>("ptf");
  const [showDetails, setShowDetails] = useState<boolean>(false);

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
  const fmtTl = (n: number) => `₺${fmt(n)}`;
  const perMwhFromConsumption = (amountTl: number) =>
    invoiceSummary.toplamTuketim > 0 && amountTl > 0 ? (amountTl / invoiceSummary.toplamTuketim) * 1000 : null;

  const cezaToplam = invoiceSummary.gucAsimCezasi + invoiceSummary.reaktifCezasi;

  const invoiceItems = [
    { label: "PTF bedeli", value: invoiceSummary.ptfMaliyet },
    { label: "YEKDEM bedeli", value: invoiceSummary.yekdem },
    { label: "YEKDEM mahsuplaşma", value: invoiceSummary.yekdemMahsup },
    { label: "Marj bedeli", value: invoiceSummary.marj },
    { label: "Dağıtım bedeli", value: invoiceSummary.dagitimBedeli },
    { label: "Güç bedeli", value: invoiceSummary.gucBedeli },
    { label: "Güç aşım cezası", value: invoiceSummary.gucAsimCezasi },
    { label: "Reaktif ceza", value: invoiceSummary.reaktifCezasi },
    { label: "Fon ve ek vergiler", value: invoiceSummary.fonVeEkVergiler },
    { label: "KDV", value: invoiceSummary.kdv },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <button
            onClick={() => navigate("/faturalar")}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Faturalara Dön</span>
          </button>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5 sm:gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Fatura Detayı</h1>
              <p className="text-sm text-muted-foreground">{invoiceId} / {invoicePeriod}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Piyasa Anlaşması: <span className="font-medium text-foreground">{invoiceMetadata.piyasaAnlasmasi}</span>
            </p>
          </div>
        </div>

        {/* Metadata */}
        <div className="bg-card rounded-2xl border border-border px-4 py-3 sm:px-5 sm:py-4">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 sm:gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Abonelik</p>
              <p className="text-sm font-medium text-foreground">{invoiceMetadata.abonelikAdi}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tesisat No</p>
              <p className="text-sm font-medium text-foreground">{invoiceMetadata.tesisatNo}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">YEKDEM türü</p>
              <p className="text-sm font-medium text-foreground">{invoiceMetadata.yekdemTuru}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Dönem</p>
              <p className="text-sm font-medium text-foreground">{invoiceMetadata.donem}</p>
            </div>
          </div>
        </div>

        {/* Details: main invoice items + compact unit prices künye */}
        <div className="bg-card rounded-2xl border border-border p-4 lg:p-5 space-y-4">
          {/* Card header: toplam fatura üst sağda */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Fatura kalemleri
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Kalem bazlı maliyet dağılımı
              </p>
            </div>
            <div className="text-right space-y-0.5 shrink-0">
              <p className="text-xs text-muted-foreground">Toplam fatura</p>
              <p className="text-xl font-bold text-primary leading-tight">
                {fmtTl(invoiceSummary.toplam)}
              </p>
              <p className="text-xs text-muted-foreground">
                {fmt(invoiceSummary.toplamTuketim)} kWh
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            {/* Main: invoice items */}
            <div className="flex-1">
              <div className="rounded-xl border border-border px-4 py-3 space-y-2">
                {invoiceItems.map((it) => (
                  <KeyValueRow key={it.label} label={it.label} value={fmtTl(it.value)} />
                ))}
              </div>
            </div>

            {/* Aside: compact unit prices künye */}
            <div className="w-full lg:max-w-xs space-y-2">
              <p className="text-sm font-semibold text-foreground">
                Birim fiyat özet
              </p>
              <div className="rounded-xl bg-secondary/40 border border-border px-3 py-2.5 space-y-1.5">
                <KeyValueRow
                  label="PTF birim fiyat"
                  value={`${fmt(invoiceSummary.ptfBirimFiyat)} TL/MWh`}
                  emphasis
                />
                <KeyValueRow
                  label="YEKDEM birim fiyat"
                  value={`${fmt(invoiceSummary.yekdemBirimFiyat)} TL/MWh`}
                  emphasis
                />
                <KeyValueRow
                  label="Dağıtım birim fiyat"
                  value={
                    perMwhFromConsumption(invoiceSummary.dagitimBedeli) == null
                      ? "—"
                      : `${fmt(perMwhFromConsumption(invoiceSummary.dagitimBedeli) ?? 0)} TL/MWh`
                  }
                />
                <KeyValueRow
                  label="Güç birim fiyat"
                  value={
                    perMwhFromConsumption(invoiceSummary.gucBedeli) == null
                      ? "—"
                      : `${fmt(perMwhFromConsumption(invoiceSummary.gucBedeli) ?? 0)} TL/MWh`
                  }
                />
                <KeyValueRow
                  label="Ceza birim fiyat"
                  value={
                    perMwhFromConsumption(cezaToplam) == null
                      ? "—"
                      : `${fmt(perMwhFromConsumption(cezaToplam) ?? 0)} TL/MWh`
                  }
                />
              </div>
            </div>
          </div>
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
    </DashboardLayout>
  );
};

export default FaturaDetay;
