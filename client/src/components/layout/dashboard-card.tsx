import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass?: string;
  percentage?: {
    value: number;
    trend: 'up' | 'down';
  };
  subtext?: string;
}

export function DashboardCard({ 
  title, 
  value, 
  icon, 
  colorClass,
  percentage,
  subtext 
}: DashboardCardProps) {
  return (
    <Card className={cn("bg-card shadow-sm", colorClass)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {percentage && (
          <p className={cn(
            "text-xs font-medium",
            percentage.trend === 'up' ? "text-success" : "text-destructive"
          )}>
            {percentage.trend === 'up' ? '↑' : '↓'} {percentage.value}%
          </p>
        )}
        {subtext && (
          <p className="text-xs text-muted-foreground mt-1">
            {subtext}
          </p>
        )}
      </CardContent>
    </Card>
  );
}