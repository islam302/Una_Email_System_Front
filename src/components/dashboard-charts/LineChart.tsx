/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataEntry {
  name: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200 text-center">
        <p className="font-bold text-gray-800">{label}</p>
        <p className="text-[#be27ce]">
          <span className="font-semibold">Value:</span> {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const DashboardLineChart: React.FC<{ data?: DataEntry[] }> = ({
  data = [],
}) => {
  // Sample data for testing
  const sampleData: DataEntry[] = [
    { name: "January", value: 4000 },
    { name: "February", value: 3000 },
    { name: "March", value: 5000 },
    { name: "April", value: 2780 },
    { name: "May", value: 1890 },
    { name: "June", value: 2390 },
    { name: "July", value: 3490 },
    { name: "August", value: 4000 },
    { name: "September", value: 4500 },
    { name: "October", value: 3800 },
    { name: "November", value: 4300 },
    { name: "December", value: 5000 },
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const chartData =
    data.length > 0
      ? months.map((month) => {
          const found = data.find((d) => d.name === month);
          return {
            name: month.substring(0, 3),
            value: found ? found.value : 0,
          };
        })
      : sampleData.map((item) => ({
          ...item,
          name: item.name.substring(0, 3),
        }));

  return (
    <div className="w-full h-[400px] bg-white py-4 rounded-lg shadow-sm border border-gray-100">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#007373" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#007373" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f0f0f0"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: "#be27ce",
              strokeWidth: 1,
              strokeDasharray: "3 3",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#be27ce"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: "#fff", stroke: "#be27ce" }}
            activeDot={{
              r: 8,
              strokeWidth: 2,
              fill: "#fff",
              stroke: "#be27ce",
            }}
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardLineChart;
