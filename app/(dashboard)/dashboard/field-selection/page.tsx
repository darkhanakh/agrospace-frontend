// File: components/FieldSelectionPage.tsx

"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/utils/supabase/client";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FieldSelectionPage = () => {
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  const [userData, setUserData] = useState(null);
  const [fieldLayers, setFieldLayers] = useState<L.Layer[]>([]);

  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Проверка аутентификации пользователя
    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data.user) {
        router.replace("/auth/login");
      } else {
        // Загрузка сохраненных полей пользователя
        loadUserFields(data.user);
      }
    });
  }, []);

  const loadUserFields = async (userData) => {
    const { data, error } = await supabase
      .from("fields")
      .select("geometry")
      .eq("user_id", userData.id);

    if (error) {
      console.error("Ошибка при загрузке полей:", error);
      return;
    }

    if (data && data.length > 0 && mapRef.current) {
      data.forEach((field) => {
        const layer = L.geoJSON(field.geometry);
        layer.addTo(mapRef.current!);
        setFieldLayers((prev) => [...prev, layer]);
      });
    }
  };

  useEffect(() => {
    if (mapRef.current) {
      const mapInstance = mapRef.current;

      const drawnItems = new L.FeatureGroup();
      mapInstance.addLayer(drawnItems);

      const drawControl = new L.Control.Draw({
        edit: {
          featureGroup: drawnItems,
        },
        draw: {
          polyline: false,
          circle: false,
          rectangle: false,
          marker: false,
          circlemarker: false,
          polygon: {
            allowIntersection: false,
            showArea: true,
            drawError: {
              color: "#e1e100",
              message: "<strong>Ошибка:</strong> Нельзя пересекать линии!",
            },
            shapeOptions: {
              color: "#97009c",
            },
          },
        },
      });

      mapInstance.addControl(drawControl);

      mapInstance.on(L.Draw.Event.CREATED, (e: any) => {
        const layer = e.layer;
        drawnItems.addLayer(layer);
        setFieldLayers([layer]);
      });

      mapInstance.on(L.Draw.Event.EDITED, (e: any) => {
        const layers = e.layers;
        layers.eachLayer((layer: L.Layer) => {
          setFieldLayers([layer]);
        });
      });
    }
  }, [mapRef.current]);

  const onSaveField = async () => {
    if (fieldLayers.length === 0) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, нарисуйте поле перед сохранением.",
        status: "error",
      });
      return;
    }

    const geojsonData = fieldLayers.map((layer) => layer.toGeoJSON());

    const { error } = await supabase.from("fields").insert([
      {
        user_id: userData.id,
        geometry: geojsonData[0], // Сохраняем как jsonb
      },
    ]);

    if (error) {
      console.error("Ошибка при сохранении поля:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить поле.",
        status: "error",
      });
    } else {
      toast({
        title: "Успех",
        description: "Поле успешно сохранено.",
        status: "success",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="bg-white shadow-lg rounded-lg p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Выбор вашего поля
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-gray-600">
            Используйте инструменты на карте, чтобы нарисовать границы вашего
            поля. После завершения нажмите "Сохранить поле", чтобы сохранить его
            в вашем профиле.
          </p>
          <div className="h-96 w-full rounded-lg overflow-hidden mb-4">
            <MapContainer
              center={[55.751244, 37.618423]}
              zoom={5}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%" }}
              ref={mapRef}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </MapContainer>
          </div>
          <Button onClick={onSaveField} variant="primary">
            Сохранить поле
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FieldSelectionPage;
