// File: components/DashboardPage.tsx

"use client";

import React, { useEffect, useState } from "react";
import {
  Bell,
  Cloud,
  Droplet,
  Menu,
  Sun,
  ThermometerSun,
  User,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebarStore } from "@/store/sidebar-store";
import { createClient } from "@/lib/utils/supabase/client";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Исправление для иконок Leaflet
import L from "leaflet";
import Link from "next/link";

const DashboardPage = () => {
  const supabase = createClient();
  const router = useRouter();
  const { setIsSidebarOpen } = useSidebarStore();

  const [userData, setUserData] = useState<any>(null);
  const [soilMoisture, setSoilMoisture] = useState<number>(0);
  const [temperature, setTemperature] = useState<number>(0);
  const [precipitation, setPrecipitation] = useState<number>(0);
  const [cropHealthIndex, setCropHealthIndex] = useState<number>(0);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [communityInsights, setCommunityInsights] = useState<string[]>([]);
  const [latitude, setLatitude] = useState<number>(55.751244); // Координаты по умолчанию (Москва)
  const [longitude, setLongitude] = useState<number>(37.618423);

  useEffect(() => {
    // Проверка аутентификации пользователя
    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data.user) {
        router.replace("/auth/login");
      } else {
        setUserData(data.user);
        // Загрузка данных после аутентификации
        loadData();
      }
    });
  }, []);

  const loadData = async () => {
    // Здесь вы можете выполнить запросы к вашим API или базе данных для получения данных
    // Для примера, установим случайные значения
    setSoilMoisture(72);
    setTemperature(26);
    setPrecipitation(15);
    setCropHealthIndex(85);
    setAlerts([
      "Возможны засушливые условия через 2 недели",
      "Оптимальные условия для посадки на следующей неделе",
    ]);
    setCommunityInsights([
      "Ближайшие фермы сообщают о повышенной активности вредителей",
      "Ожидается рост цен на кукурузу на местном рынке",
    ]);

    // Получение координат пользователя (пример)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Не удалось получить геолокацию:", error);
        }
      );
    }
  };

  return (
    <div className="flex bg-gray-100 dark:bg-gray-900">
      {/* Основной контент */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Верхняя навигация */}
        <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                    <AvatarFallback>
                      {userData ? userData.email.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userData ? userData.email : "Пользователь"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userData ? userData.email : "example@mail.com"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link className="flex items-center" href="/dashboard/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Профиль</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Настройки</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await supabase.auth.signOut();
                    router.replace("/auth/login");
                  }}
                >
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Контент панели управления */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">
              Панель управления фермой
            </h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Влажность почвы */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Влажность почвы
                  </CardTitle>
                  <Droplet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{soilMoisture}%</div>
                  <Progress value={soilMoisture} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Оптимальный диапазон: 60-80%
                  </p>
                </CardContent>
              </Card>
              {/* Температура */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Температура
                  </CardTitle>
                  <ThermometerSun className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{temperature}°C</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    На 2°C выше средней
                  </p>
                </CardContent>
              </Card>
              {/* Прогноз осадков */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Прогноз осадков
                  </CardTitle>
                  <Cloud className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{precipitation} мм</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Ожидается в ближайшие 7 дней
                  </p>
                </CardContent>
              </Card>
            </div>
            {/* Индекс здоровья культур */}
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Индекс здоровья культур</CardTitle>
                  <CardDescription>
                    На основе данных NDVI за последние 30 дней
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{cropHealthIndex}%</div>
                  <Progress value={cropHealthIndex} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Индекс здоровья культур в норме
                  </p>
                </CardContent>
              </Card>
            </div>
            {/* Карта поля */}
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ваше поле на карте</CardTitle>
                  <CardDescription>Местоположение вашего поля</CardDescription>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            </div>
            {/* Последние оповещения и инсайты сообщества */}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {/* Последние оповещения */}
              <Card>
                <CardHeader>
                  <CardTitle>Последние оповещения</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {alerts.map((alert, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                        <span>{alert}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              {/* Инсайты сообщества */}
              <Card>
                <CardHeader>
                  <CardTitle>Инсайты сообщества</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {communityInsights.map((insight, index) => (
                      <li key={index}>{insight}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
