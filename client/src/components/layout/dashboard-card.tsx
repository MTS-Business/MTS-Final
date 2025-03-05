import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className={cn(
        "bg-card shadow-sm hover:shadow-md transition-all duration-300",
        "border-l-4",
        colorClass || "border-l-primary",
      )}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="text-primary">{icon}</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{value}</div>
          {percentage && (
            <div className="flex items-center mt-1">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={cn(
                  "text-xs font-medium flex items-center",
                  percentage.trend === 'up' ? "text-success" : "text-destructive"
                )}
              >
                {percentage.trend === 'up' ? '↑' : '↓'} {percentage.value}%
              </motion.div>
            </div>
          )}
          {subtext && (
            <p className="text-xs text-muted-foreground mt-1">
              {subtext}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}