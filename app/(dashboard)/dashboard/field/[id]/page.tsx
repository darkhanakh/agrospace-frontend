// File: components/FieldAnalyticsPage.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/utils/supabase/client";
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

// Импорт Recharts компонентов
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

const FieldAnalyticsPage = () => {
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();

  const [field, setField] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nasaLoading, setNasaLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [chartData, setChartData] = useState([
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

      setChartData((prevData) => [...prevData.slice(-6), newEntry]);
    }, 10000); // Обновление каждые 5 секунд

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

  useEffect(() => {
    if (id) {
      loadFieldData();
    }
  }, [id]);

  const loadFieldData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("fields")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Ошибка при загрузке данных поля:", error);
      setLoading(false);
      return;
    }

    setField(data);
    setAnalytics({
      area: calculateArea(data.geometry),
      soilType: "Суглинок",
      lastHarvest: "2023-09-15",
      yield: "4.5 тонны/гектар",
    });
    setLoading(false);

    // Simulate NASA data loading
    setTimeout(() => {
      setNasaLoading(false);
    }, 3000);

    // Fetch weather data
    if (
      data.geometry &&
      data.geometry.geometry &&
      data.geometry.geometry.coordinates
    ) {
      const [lon, lat] = data.geometry.geometry.coordinates[0][0];
      fetchWeatherData(lat, lon);
    }
  };

  const fetchWeatherData = async (lat: number, lon: number) => {
    const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!API_KEY) {
      console.error("Отсутствует API ключ для OpenWeather.");
      return;
    }
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    const data = await response.json();
    setWeatherData(data);
  };

  const calculateArea = (geometry: any) => {
    if (!geometry || !geometry.geometry || !geometry.geometry.coordinates) {
      return "N/A";
    }
    const polygon = L.polygon(geometry.geometry.coordinates[0]);
    const area = L.GeometryUtil.geodesicArea(polygon.getLatLngs()[0]);
    return (area / 10000).toFixed(2);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Card className="bg-white shadow-lg rounded-lg p-6">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-6 w-1/2 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="h-64 md:h-full">
                <Skeleton className="h-full w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!field || !analytics) {
    return (
      <div className="container mx-auto p-4">
        <Card className="bg-white shadow-lg rounded-lg p-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Поле не найдено
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Извините, мы не смогли найти поле, которое вы ищете.</p>
            <Link href="/dashboard/field" passHref>
              <Button variant="outline" className="mt-4">
                Вернуться к полям
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card className="bg-white shadow-lg rounded-lg p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Аналитика по полю: {field.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Информация о поле</h3>
              <p>Площадь: {analytics.area} гектаров</p>
              <p>Тип почвы: {analytics.soilType}</p>
              <p>Последний сбор урожая: {analytics.lastHarvest}</p>
              <p>Урожайность: {analytics.yield}</p>

              {nasaLoading ? (
                <div className="mt-4">
                  <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                  Загрузка данных со спутников NASA...
                </div>
              ) : (
                <div className="mt-4">
                  <h4 className="font-semibold">Данные со спутников NASA</h4>
                  <p>Индекс вегетации: 0.76</p>
                  <p>Влажность почвы: 35%</p>
                </div>
              )}

              {weatherData && (
                <div className="mt-4">
                  <h4 className="font-semibold">Текущая погода</h4>
                  <p>Температура: {weatherData.main.temp}°C</p>
                  <p>Влажность: {weatherData.main.humidity}%</p>
                  <p>Погодные условия: {weatherData.weather[0].description}</p>
                </div>
              )}
            </div>
            <div className="h-64 md:h-full">
              {field.geometry &&
                field.geometry.geometry &&
                field.geometry.geometry.coordinates && (
                  <MapContainer
                    center={field.geometry.geometry.coordinates[0][0]
                      .slice()
                      .reverse()}
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Polygon
                      positions={field.geometry.geometry.coordinates[0].map(
                        (coord: number[]) => coord.slice().reverse()
                      )}
                      pathOptions={{ color: "#00FF00", weight: 2 }}
                    />
                  </MapContainer>
                )}
            </div>
          </div>

          {/* Добавляем раздел с диаграммами */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Аналитика данных</h3>
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
                      <LineChart data={chartData}>
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
                      <AreaChart data={chartData}>
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
              {/* Осадки */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Осадки (мм)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart data={chartData}>
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
              {/* Влажность почвы */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Влажность почвы (%)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer>
                      <LineChart data={chartData}>
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
              {/* Температура */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Температура (°C)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer>
                      <AreaChart data={chartData}>
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
              {/* Сводный анализ */}
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
                        <Scatter
                          name="Показатели"
                          data={chartData}
                          fill="#8884d8"
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Остальной контент вашего компонента */}
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

export default FieldAnalyticsPage;
