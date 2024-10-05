"use client";

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

export default function Dashboard() {
  const { setIsSidebarOpen } = useSidebarStore();

  return (
    <div className="flex bg-gray-100 dark:bg-gray-900">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
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
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      john@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">
              Farm Dashboard
            </h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Soil Moisture
                  </CardTitle>
                  <Droplet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">68%</div>
                  <Progress value={68} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Optimal range: 60-80%
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Temperature
                  </CardTitle>
                  <ThermometerSun className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24°C</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    3°C above average
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Precipitation Forecast
                  </CardTitle>
                  <Cloud className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">30mm</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Expected in next 7 days
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Crop Health Index</CardTitle>
                  <CardDescription>
                    Based on NDVI data from the last 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                </CardContent>
              </Card>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                      <span>Potential drought conditions in 2 weeks</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      <span>Optimal planting conditions next week</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Community Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>Nearby farms reporting increased pest activity</li>
                    <li>Local market prices for corn expected to rise</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
