"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const WaterDataPage = () => {
  // Заранее заданные данные
  const data = [
    { date: "2023-01-01", precipitation: 5 },
    { date: "2023-01-02", precipitation: 10 },
    { date: "2023-01-03", precipitation: 7 },
    { date: "2023-01-04", precipitation: 12 },
    { date: "2023-01-05", precipitation: 4 },
    { date: "2023-01-06", precipitation: 8 },
    { date: "2023-01-07", precipitation: 6 },
  ];

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Данные о осадках</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis
                  label={{
                    value: "Осадки (мм)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="precipitation"
                  stroke="#8884d8"
                  name="Осадки (мм)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaterDataPage;
