// File: components/WaterDataPage.tsx

"use client";

import React, { useEffect, useState } from "react";
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
  BarChart,
  Bar,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
} from "recharts";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const WaterDataPage = () => {
  // Состояние для хранения данных
  const [data, setData] = useState([
    {
      date: "2023-10-01",
      precipitation: 5,
      soilMoisture: 60,
      temperature: 15,
      ndvi: 0.65,
      evapotranspiration: 3.2,
    },
    {
      date: "2023-10-02",
      precipitation: 10,
      soilMoisture: 62,
      temperature: 16,
      ndvi: 0.68,
      evapotranspiration: 3.5,
    },
    {
      date: "2023-10-03",
      precipitation: 7,
      soilMoisture: 64,
      temperature: 17,
      ndvi: 0.7,
      evapotranspiration: 3.8,
    },
    {
      date: "2023-10-04",
      precipitation: 12,
      soilMoisture: 66,
      temperature: 18,
      ndvi: 0.72,
      evapotranspiration: 4.0,
    },
    {
      date: "2023-10-05",
      precipitation: 4,
      soilMoisture: 65,
      temperature: 16,
      ndvi: 0.71,
      evapotranspiration: 3.7,
    },
    {
      date: "2023-10-06",
      precipitation: 8,
      soilMoisture: 63,
      temperature: 17,
      ndvi: 0.69,
      evapotranspiration: 3.6,
    },
    {
      date: "2023-10-07",
      precipitation: 6,
      soilMoisture: 61,
      temperature: 15,
      ndvi: 0.67,
      evapotranspiration: 3.3,
    },
  ]);

  // Имитация интеграции с NASA: загрузка спутниковых данных
  useEffect(() => {
    // Здесь вы можете добавить реальный вызов к API NASA или использовать имитацию данных
    // Для демонстрации обновим NDVI случайными данными
    const interval = setInterval(() => {
      const newEntry = {
        date: new Date().toISOString().split("T")[0],
        precipitation: Math.floor(Math.random() * 10),
        soilMoisture: Math.floor(Math.random() * 20) + 60,
        temperature: Math.floor(Math.random() * 10) + 15,
        ndvi: parseFloat((Math.random() * 0.2 + 0.6).toFixed(2)),
        evapotranspiration: parseFloat((Math.random() * 1 + 3).toFixed(2)),
      };

      setData((prevData) => [...prevData.slice(-6), newEntry]);
    }, 5000); // Обновление каждые 5 секунд

    return () => clearInterval(interval);
  }, []);

  // Пример геоданных поля
  const fieldGeoJSON = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [37.6175, 55.7558],
          [37.6275, 55.7558],
          [37.6275, 55.7658],
          [37.6175, 55.7658],
          [37.6175, 55.7558],
        ],
      ],
    },
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Аналитика поля</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Карта с наложением поля */}
          <div className="h-96 w-full rounded-lg overflow-hidden mb-6">
            <MapContainer
              center={[55.7558, 37.6175]}
              zoom={13}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <GeoJSON
                data={fieldGeoJSON}
                style={{ color: "#00FF00", weight: 2 }}
              />
            </MapContainer>
          </div>
          {/* Спутниковые данные */}
          <h2 className="text-2xl font-semibold mb-4">Спутниковые данные</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NDVI график */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  NDVI (Индекс здоровья растений)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart data={data}>
                      <XAxis dataKey="date" />
                      <YAxis domain={[0.5, 1]} />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Line type="monotone" dataKey="ndvi" stroke="#ff7300" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            {/* Эвапотранспирация */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Эвапотранспирация (мм/день)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient
                          id="colorET"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#8884d8"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8884d8"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="evapotranspiration"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorET)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Графики климатических данных */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Климатические данные и показатели поля
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* График осадков */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Осадки (мм)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="precipitation" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* График влажности почвы */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Влажность почвы (%)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart data={data}>
                      <XAxis dataKey="date" />
                      <YAxis domain={[50, 80]} />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="soilMoisture"
                        stroke="#82ca9d"
                        name="Влажность почвы"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* График температуры */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Температура (°C)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient
                          id="colorTemp"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#ffc658"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#ffc658"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="temperature"
                        stroke="#ffc658"
                        fillOpacity={1}
                        fill="url(#colorTemp)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Сводный график */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Сводный анализ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <ScatterChart>
                      <CartesianGrid />
                      <XAxis
                        dataKey="temperature"
                        name="Температура"
                        unit="°C"
                      />
                      <YAxis
                        dataKey="soilMoisture"
                        name="Влажность почвы"
                        unit="%"
                      />
                      <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                      <Scatter name="Показатели" data={data} fill="#8884d8" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Имитация интеграции с NASA и IoT */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Интеграция с NASA и IoT датчиками
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Данные обновляются в реальном времени, используя спутниковые
            наблюдения и показания с IoT датчиков на вашем поле.
          </p>
          <Button
            onClick={() =>
              alert("Настройка интеграции с NASA и IoT устройствами.")
            }
          >
            Настроить интеграцию
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaterDataPage;
