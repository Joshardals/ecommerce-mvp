import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSalesData } from "@/lib/action/prisma.actions";
import { formatCurrency, formatNumber } from "@/lib/formatter";

export default async function AdminDashboard() {
  const salesData = await getSalesData();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Sales"
        subtitle={`${formatNumber(salesData?.numberOfSales!)} Orders`}
        body={formatCurrency(salesData?.amount!)}
      />
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  subtitle: string;
  body: string;
}

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  );
}
