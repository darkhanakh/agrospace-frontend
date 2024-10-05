"use client";

import React, { useState } from "react";
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
import AIChat from "@/components/shared/ai-chat"; // Предполагается, что у вас уже есть компонент AIChat
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const PlannerPage = () => {
  const [soilType, setSoilType] = useState("");
  const [cropType, setCropType] = useState("");
  const [fieldArea, setFieldArea] = useState("");
  const [rootDepth, setRootDepth] = useState("");
  const [useWeatherData, setUseWeatherData] = useState(false);
  const [manualWeatherData, setManualWeatherData] = useState({
    temperature: "",
    humidity: "",
    precipitation: "",
  });
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [subscribeAlerts, setSubscribeAlerts] = useState(false);
  const [saveData, setSaveData] = useState(false);

  const handleCalculate = () => {
    // Здесь вы можете добавить логику для расчета на основе введенных данных
    // Например, сделать запрос к серверу или использовать ИИ для генерации рекомендаций
    const calculatedResults = {
      waterVolume: "96,000 литров в день",
      irrigationSchedule: "2 раза в неделю по 48,000 литров",
      weatherNote: "В ближайшие дни ожидается дождь. Скорректируйте полив.",
      tips: [
        "Поливайте рано утром или поздно вечером, чтобы минимизировать испарение.",
        "Проверьте почву на наличие вредителей во влажные периоды.",
      ],
    };
    setResults(calculatedResults);
    setShowResults(true);
  };

  const handleSaveData = () => {
    // Логика сохранения данных пользователя
    setSaveData(true);
  };

  const handleSubscribeAlerts = () => {
    // Логика подписки на оповещения
    setSubscribeAlerts(true);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Калькулятор Полива и Рекомендации ИИ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Используйте наш калькулятор, чтобы получить персонализированные
            рекомендации по поливу и уходу за полем. Просто введите данные о
            типе почвы, культуре и размере вашего поля, и наш ИИ рассчитает
            оптимальный график полива и предложит советы по уходу, учитывая
            климатические условия и специфические характеристики вашего участка.
          </p>
          {/* Форма для ввода данных */}
          <div className="space-y-4">
            {/* Тип почвы */}
            <div>
              <Label htmlFor="soilType">Тип почвы</Label>
              <Select onValueChange={setSoilType}>
                <SelectTrigger id="soilType">
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
              <p className="text-sm text-muted-foreground">
                Укажите тип почвы на вашем поле. Это важно для расчета, так как
                разные почвы имеют разные способности удерживать влагу.
              </p>
            </div>
            {/* Тип культуры */}
            <div>
              <Label htmlFor="cropType">Тип культуры</Label>
              <Select onValueChange={setCropType}>
                <SelectTrigger id="cropType">
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
              <p className="text-sm text-muted-foreground">
                Выберите культуру, которую вы выращиваете. Разные растения
                требуют разного объема воды и ухода.
              </p>
            </div>
            {/* Площадь поля */}
            <div>
              <Label htmlFor="fieldArea">Площадь поля (га)</Label>
              <Input
                id="fieldArea"
                type="number"
                placeholder="Введите площадь в гектарах"
                value={fieldArea}
                onChange={(e) => setFieldArea(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Введите площадь в гектарах (1 га = 10,000 м²)
              </p>
            </div>
            {/* Дополнительные параметры */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                Дополнительные параметры (опционально)
              </h3>
              {/* Глубина корней */}
              <div>
                <Label htmlFor="rootDepth">Глубина корней (см)</Label>
                <Input
                  id="rootDepth"
                  type="number"
                  placeholder="Введите глубину корней"
                  value={rootDepth}
                  onChange={(e) => setRootDepth(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Для некоторых культур важно учитывать глубину корней, что
                  может влиять на график полива.
                </p>
              </div>
              {/* Климатические условия */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="useWeatherData"
                  checked={useWeatherData}
                  onCheckedChange={setUseWeatherData}
                />
                <Label htmlFor="useWeatherData">
                  Учитывать погодные данные
                </Label>
              </div>
              {useWeatherData && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="autoWeather"
                      checked={!manualWeatherData.temperature}
                      onCheckedChange={(checked) =>
                        setManualWeatherData((prev) => ({
                          temperature: checked ? "" : prev.temperature,
                          humidity: checked ? "" : prev.humidity,
                          precipitation: checked ? "" : prev.precipitation,
                        }))
                      }
                    />
                    <Label htmlFor="autoWeather">
                      Учитывать погодные данные автоматически
                    </Label>
                  </div>
                  {!manualWeatherData.temperature && (
                    <div>
                      <Label>Введите погодные данные вручную</Label>
                      <div className="grid grid-cols-3 gap-2">
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
                        <Input
                          type="number"
                          placeholder="Осадки (мм)"
                          value={manualWeatherData.precipitation}
                          onChange={(e) =>
                            setManualWeatherData((prev) => ({
                              ...prev,
                              precipitation: e.target.value,
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
            <Button onClick={handleCalculate}>Получить рекомендации</Button>
          </div>
        </CardContent>
      </Card>

      {/* Результаты и рекомендации */}
      {showResults && results && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center space-x-2">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {/* Example icon */}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c1.657 0 3-1.567 3-3.5S13.657 1 12 1 9 2.567 9 4.5s1.343 3.5 3 3.5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 21h14M5 10h14M5 6h14M5 14h14"
                />
              </svg>
              <span>Ваш график полива и рекомендации</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Water Volume */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg
                    className="w-10 h-10 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {/* Water drop icon */}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 2C12 2 4 10 4 14a8 8 0 0016 0c0-4-8-12-8-12z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold">Объем воды для полива</p>
                  <p className="text-xl font-bold text-blue-600">
                    {results.waterVolume}
                  </p>
                </div>
              </div>
              {/* Irrigation Schedule */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg
                    className="w-10 h-10 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {/* Calendar icon */}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3M16 7V3M3 11h18M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold">График полива</p>
                  <p className="text-xl font-bold text-green-600">
                    {results.irrigationSchedule}
                  </p>
                </div>
              </div>
            </div>
            {/* Weather Note */}
            {results.weatherNote && (
              <div className="p-4 bg-yellow-100 rounded-lg flex items-center space-x-3">
                <svg
                  className="w-8 h-8 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {/* Weather icon */}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 15a4 4 0 010-8 4.001 4.001 0 017.9-1.4A5.5 5.5 0 1121 11h-1"
                  />
                </svg>
                <p className="text-yellow-800 font-medium">
                  {results.weatherNote}
                </p>
              </div>
            )}
            {/* Additional Tips */}
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Дополнительные советы
              </h3>
              <ul className="space-y-2">
                {results.tips.map((tip: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <svg
                      className="w-6 h-6 text-primary mt-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      {/* Checkmark icon */}
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p>{tip}</p>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Chat with AI Bot */}
            <div className="flex items-center space-x-2">
              <p className="font-medium">
                Хотите узнать больше? Задайте вопросы нашему ИИ-боту!
              </p>
              <Button onClick={() => setIsChatOpen(true)} variant="outline">
                Спросить ИИ
              </Button>
            </div>
            {/* Actions */}
            <div className="flex space-x-4">
              {/* Save Recommendations */}
              <Button onClick={handleSaveData} variant="secondary">
                Сохранить рекомендации
              </Button>
              {saveData && (
                <span className="text-green-600 font-medium">
                  Рекомендации сохранены
                </span>
              )}
              {/* Subscribe to Alerts */}
              <Button onClick={handleSubscribeAlerts} variant="secondary">
                Подписаться на оповещения
              </Button>
              {subscribeAlerts && (
                <span className="text-green-600 font-medium">
                  Вы подписаны на оповещения
                </span>
              )}
            </div>
          </CardFooter>
        </Card>
      )}

      {/* Модальное окно с чатом ИИ */}
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
