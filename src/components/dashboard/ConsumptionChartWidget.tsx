import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const consumptionData = [
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
  { name: "Ara", tuketim: 245 },
];

export function ConsumptionChartWidget() {
  const { language } = useLanguage();

  return (
    <Link to="/tuketim-analizi">
      <div className="bg-card rounded-2xl border border-border overflow-hidden card-hover cursor-pointer h-full p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-semibold text-foreground text-sm">
              {language === "tr" ? "Yıllık Tüketim" : "Yearly Consumption"}
            </h4>
            <p className="text-xs text-muted-foreground">
              {language === "tr" ? "Detaylı analiz için tıklayın" : "Click for details"}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={consumptionData}>
              <defs>
                <linearGradient id="chartWidgetGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: number) => [`${value} kWh`, language === "tr" ? 'Tüketim' : 'Consumption']}
              />
              <Area 
                type="monotone" 
                dataKey="tuketim" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1} 
                fill="url(#chartWidgetGradient)" 
                strokeWidth={2} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Link>
  );
}
