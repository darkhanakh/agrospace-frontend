// File: components/PlannerPage.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AIChat from "@/components/shared/ai-chat";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { getRecommendations } from "@/app/actions/generateRecommendations";
import { useToast } from "@/hooks/use-toast";

// Импорты для карты
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Исправление для иконок Leaflet
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").default,
  iconUrl: require("leaflet/dist/images/marker-icon.png").default,
  shadowUrl: require("leaflet/dist/images/marker-shadow.png").default,
});

const PlannerPage = () => {
  const [soilType, setSoilType] = useState("");
  const [cropType, setCropType] = useState("");
  const [fieldArea, setFieldArea] = useState("");
  const [rootDepth, setRootDepth] = useState("");
  const [useWeatherData, setUseWeatherData] = useState(false);
  const [useAutomaticWeatherData, setUseAutomaticWeatherData] = useState(true);
  const [manualWeatherData, setManualWeatherData] = useState({
    temperature: "",
    humidity: "",
  });
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [subscribeAlerts, setSubscribeAlerts] = useState(false);
  const [saveData, setSaveData] = useState(false);
  const [alertHighTemp, setAlertHighTemp] = useState(true);
  const [alertFrost, setAlertFrost] = useState(true);
  const { toast } = useToast();

  // Новые состояния
  const [risksData, setRisksData] = useState<any>([]);
  const [loading, setLoading] = useState(false); // Для индикатора загрузки

  useEffect(() => {
    if (useWeatherData && useAutomaticWeatherData) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
          },
          (error) => {
            console.error("Error getting geolocation: ", error);
            toast({
              title: "Ошибка",
              description: "Не удалось получить геолокацию.",
              status: "error",
            });
          }
        );
      } else {
        console.error("Geolocation not available");
        toast({
          title: "Ошибка",
          description: "Геолокация недоступна в вашем браузере.",
          status: "error",
        });
      }
    }
  }, [useWeatherData, useAutomaticWeatherData]);

  const fetchDetailedWeatherData = async () => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=ru&appid=${process.env.NEXT_PUBLIC_WEATHER}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      return data; // Возвращаем погодные данные
    } catch (error) {
      console.error("Error fetching detailed weather data: ", error);
      toast({
        title: "Ошибка",
        description: "Не удалось получить погодные данные.",
        status: "error",
      });
      return null;
    }
  };

  useEffect(() => {
    if (latitude && longitude && useAutomaticWeatherData && useWeatherData) {
      const fetchWeatherData = async () => {
        const data = await fetchDetailedWeatherData();

        if (data) {
          const temperature = data.main.temp.toString();
          const humidity = data.main.humidity.toString();

          setManualWeatherData({
            temperature,
            humidity,
          });
        }
      };

      fetchWeatherData();
    }
  }, [latitude, longitude, useAutomaticWeatherData, useWeatherData]);

  const assessWeatherRisks = (weatherData: any) => {
    const risks = [];

    // Оценка риска высокой температуры
    if (alertHighTemp && weatherData.main.temp > 35) {
      risks.push({
        type: "Высокая температура",
        message:
          "Высокая температура сегодня может привести к стрессу у растений.",
      });
    }

    // Оценка риска заморозков
    if (alertFrost && weatherData.main.temp < 0) {
      risks.push({
        type: "Заморозки",
        message: "Заморозки ночью могут повредить растения.",
      });
    }

    // Добавьте дополнительные оценки по необходимости

    return risks;
  };

  // Функция для получения рекомендаций и оценки погодных рисков
  const handleCalculate = async () => {
    setLoading(true);
    const data = {
      soilType,
      cropType,
      fieldArea,
      rootDepth: rootDepth || null,
      weatherData: useWeatherData
        ? {
            temperature: manualWeatherData.temperature || null,
            humidity: manualWeatherData.humidity || null,
          }
        : null,
    };

    try {
      let weatherRisks = [];

      if (useWeatherData) {
        // Получаем подробные погодные данные
        const weatherData = await fetchDetailedWeatherData();
        if (weatherData) {
          // Оцениваем погодные риски
          weatherRisks = assessWeatherRisks(weatherData);
          setRisksData(weatherRisks);
        }
      }

      // Включаем риски в данные для получения рекомендаций
      const calculatedResults = await getRecommendations({
        ...data,
        weatherRisks,
      }); // Вызываем серверное действие

      setResults({
        ...calculatedResults.recommendations,
        weatherRisks,
      });
      setShowResults(true);
    } catch (error) {
      console.error("Error getting recommendations or weather risks: ", error);
      toast({
        title: "Ошибка",
        description: "Не удалось получить рекомендации.",
        action: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveData = () => {
    setSaveData(true);
    toast({
      title: "Успех",
      description: "Рекомендации сохранены.",
      action: "success",
    });
  };

  const handleSubscribeToWeatherAlerts = () => {
    setSubscribeAlerts(true);
    toast({
      title: "Подписка оформлена",
      description: "Вы подписаны на оповещения о погодных рисках.",
      action: "success",
    });
  };

  return (
    <div className="container mx-auto p-4">
      {/* Форма ввода */}
      <Card className="bg-white shadow-lg rounded-lg p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Калькулятор Полива и Рекомендации ИИ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-gray-600">
            Используйте наш калькулятор, чтобы получить персонализированные
            рекомендации по поливу и уходу за полем. Просто введите данные о
            типе почвы, культуре и размере вашего поля, и наш ИИ рассчитает
            оптимальный график полива и предложит советы по уходу, учитывая
            климатические условия и специфические характеристики вашего участка.
          </p>
          {/* Input Form */}
          <div className="space-y-6">
            {/* Тип почвы */}
            <div>
              <Label htmlFor="soilType" className="text-gray-700 font-medium">
                Тип почвы
              </Label>
              <Select onValueChange={setSoilType}>
                <SelectTrigger id="soilType" className="mt-2">
                  <SelectValue placeholder="Выберите тип почвы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Песчаная почва">Песчаная почва</SelectItem>
                  <SelectItem value="Суглинистая почва">
                    Суглинистая почва
                  </SelectItem>
                  <SelectItem value="Глинистая почва">
                    Глинистая почва
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 mt-2">
                Укажите тип почвы на вашем поле. Это важно для расчета, так как
                разные почвы имеют разные способности удерживать влагу.
              </p>
            </div>
            {/* Тип культуры */}
            <div>
              <Label htmlFor="cropType" className="text-gray-700 font-medium">
                Тип культуры
              </Label>
              <Select onValueChange={setCropType}>
                <SelectTrigger id="cropType" className="mt-2">
                  <SelectValue placeholder="Выберите тип культуры" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Пшеница">Пшеница</SelectItem>
                  <SelectItem value="Овощи">
                    Овощи (помидоры, огурцы и др.)
                  </SelectItem>
                  <SelectItem value="Фруктовые деревья">
                    Фруктовые деревья
                  </SelectItem>
                  <SelectItem value="Другие">Другие</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 mt-2">
                Выберите культуру, которую вы выращиваете. Разные растения
                требуют разного объема воды и ухода.
              </p>
            </div>
            {/* Площадь поля */}
            <div>
              <Label htmlFor="fieldArea" className="text-gray-700 font-medium">
                Площадь поля (га)
              </Label>
              <Input
                id="fieldArea"
                type="number"
                placeholder="Введите площадь в гектарах"
                value={fieldArea}
                onChange={(e) => setFieldArea(e.target.value)}
                className="mt-2"
              />
              <p className="text-sm text-gray-500 mt-2">
                Введите площадь в гектарах (1 га = 10,000 м²)
              </p>
            </div>
            {/* Дополнительные параметры */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Дополнительные параметры (опционально)
              </h3>
              {/* Глубина корней */}
              <div>
                <Label
                  htmlFor="rootDepth"
                  className="text-gray-700 font-medium"
                >
                  Глубина корней (см)
                </Label>
                <Input
                  id="rootDepth"
                  type="number"
                  placeholder="Введите глубину корней"
                  value={rootDepth}
                  onChange={(e) => setRootDepth(e.target.value)}
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Для некоторых культур важно учитывать глубину корней, что
                  может влиять на график полива.
                </p>
              </div>
              {/* Погодные данные */}
              <div className="flex items-center space-x-2 mt-4">
                <Switch
                  id="useWeatherData"
                  checked={useWeatherData}
                  onCheckedChange={setUseWeatherData}
                />
                <Label
                  htmlFor="useWeatherData"
                  className="text-gray-700 font-medium"
                >
                  Учитывать погодные данные
                </Label>
              </div>
              {useWeatherData && (
                <div className="space-y-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="autoWeather"
                      checked={useAutomaticWeatherData}
                      onCheckedChange={(checked) =>
                        setUseAutomaticWeatherData(checked)
                      }
                    />
                    <Label htmlFor="autoWeather" className="text-gray-700">
                      Получать погодные данные автоматически
                    </Label>
                  </div>
                  {!useAutomaticWeatherData && (
                    <div>
                      <Label className="text-gray-700 font-medium">
                        Введите погодные данные вручную
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <Input
                          type="number"
                          placeholder="Температура (°C)"
                          value={manualWeatherData.temperature}
                          onChange={(e) =>
                            setManualWeatherData((prev) => ({
                              ...prev,
                              temperature: e.target.value,
                            }))
                          }
                        />
                        <Input
                          type="number"
                          placeholder="Влажность (%)"
                          value={manualWeatherData.humidity}
                          onChange={(e) =>
                            setManualWeatherData((prev) => ({
                              ...prev,
                              humidity: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Кнопка расчета */}
            <Button
              onClick={handleCalculate}
              className="w-full md:w-auto mt-6"
              disabled={loading}
            >
              {loading ? "Загрузка..." : "Получить рекомендации"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Результаты и рекомендации */}
      {showResults && results && (
        <Card className="mt-10 bg-white shadow-lg rounded-lg p-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {/* Иконка */}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7h18M3 12h18M3 17h18"
                />
              </svg>
              <span>Ваш график полива и рекомендации</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Краткая информация */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Объем воды */}
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <svg
                    className="w-12 h-12 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {/* Иконка капли воды */}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 2C12 2 4 10 4 14a8 8 0 0016 0c0-4-8-12-8-12z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-700">
                    Объем воды для полива
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {results.waterVolume}
                  </p>
                </div>
              </div>
              {/* График полива */}
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <svg
                    className="w-12 h-12 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {/* Иконка календаря */}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3M16 7V3M3 11h18M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-700">
                    График полива
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {results.irrigationSchedule}
                  </p>
                </div>
              </div>
            </div>
            {/* Раздел рисков */}
            {risksData && risksData.length > 0 && (
              <div className="p-6 bg-red-100 rounded-lg">
                <h3 className="text-xl font-semibold text-red-700 mb-4">
                  Предупреждения о погодных рисках
                </h3>
                <ul className="list-disc list-inside text-red-700 space-y-2">
                  {risksData.map((risk: any, index: number) => (
                    <li key={index}>
                      <strong>{risk.type}:</strong> {risk.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Карта */}
            {latitude && longitude && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Ваше поле на карте
                </h3>
                <div className="h-64 w-full rounded-lg overflow-hidden">
                  <MapContainer
                    center={[latitude, longitude]}
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[latitude, longitude]}>
                      <Popup>Ваше поле находится здесь.</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            )}
            {/* Дополнительные советы */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Дополнительные советы
              </h3>
              <ul className="space-y-3">
                {results.tips.map((tip: string, index: number) => (
                  <li key={index} className="flex items-start space-x-3">
                    <svg
                      className="w-6 h-6 text-green-600 mt-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      {/* Иконка галочки */}
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-gray-700">{tip}</p>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col md:flex-row md:items-center md:justify-between space-y-6 md:space-y-0">
            {/* Чат с ИИ */}
            <div className="flex items-center space-x-4">
              <p className="font-medium text-gray-700">
                Хотите узнать больше? Задайте вопросы нашему ИИ-боту!
              </p>
              <Button onClick={() => setIsChatOpen(true)} variant="outline">
                Спросить ИИ
              </Button>
            </div>
            {/* Действия */}
            <div className="flex space-x-4">
              {/* Сохранить рекомендации */}
              <Button onClick={handleSaveData} variant="secondary">
                Сохранить рекомендации
              </Button>
              {/* Подписаться на оповещения */}
              <Button
                onClick={handleSubscribeToWeatherAlerts}
                variant="secondary"
              >
                Подписаться на оповещения
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}

      {/* Модальное окно чата с ИИ */}
      {isChatOpen && (
        <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Чат с ИИ</DialogTitle>
            </DialogHeader>
            <AIChat />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PlannerPage;
