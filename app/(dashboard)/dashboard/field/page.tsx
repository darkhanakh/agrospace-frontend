"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/utils/supabase/client";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditablePolygon } from "@/components/shared/editable-polygon";

const FieldSelectionPage = () => {
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  const [userData, setUserData] = useState(null);
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [newFieldName, setNewFieldName] = useState("");

  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data.user) {
        router.replace("/auth/login");
      } else {
        setUserData(data.user);
        loadUserFields(data.user.id);
      }
    });
  }, []);

  const loadUserFields = async (userId) => {
    const { data, error } = await supabase
      .from("fields")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Ошибка при загрузке полей:", error);
      return;
    }

    setFields(data);
    if (data.length > 0) {
      setSelectedField(data[0]);
      setNewFieldName(data[0].name || `Поле ${data[0].id.slice(0, 8)}`);
    }
  };

  const onSaveField = async () => {
    if (!selectedField || !selectedField.geometry) {
      toast({
        title: "Ошибка",
        description:
          "Пожалуйста, выберите или нарисуйте поле перед сохранением.",
        variant: "destructive",
      });
      return;
    }

    const fieldData = {
      user_id: userData.id,
      name: newFieldName || `Поле ${fields.length + 1}`,
      geometry: selectedField.geometry,
    };

    let result;
    if (selectedField.id) {
      // Обновить существующее поле
      result = await supabase
        .from("fields")
        .update(fieldData)
        .eq("id", selectedField.id)
        .select();
    } else {
      // Добавить новое поле
      result = await supabase.from("fields").insert(fieldData).select();
    }

    const { data, error } = result;

    if (error) {
      console.error("Ошибка при сохранении поля:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить поле.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Успех",
        description: "Поле успешно сохранено.",
      });
      loadUserFields(userData.id);
      if (data && data[0]) {
        setSelectedField(data[0]);
      }
    }
  };

  const onFieldCreated = (e: L.LeafletEvent) => {
    const layer = e.layer;
    const geoJSON = layer.toGeoJSON();
    setSelectedField({
      id: null,
      geometry: {
        type: "Feature",
        geometry: geoJSON.geometry,
        properties: {},
      },
    });
    setNewFieldName("");
    fitMapToBounds(geoJSON.geometry.coordinates[0]);
  };

  const onFieldEdited = (e: L.LeafletEvent) => {
    const layers = e.layers;
    layers.eachLayer((layer: L.Layer) => {
      const geoJSON = (layer as L.Polygon).toGeoJSON();
      setSelectedField((prevField) => ({
        ...prevField,
        geometry: {
          type: "Feature",
          geometry: geoJSON.geometry,
          properties: {},
        },
      }));
      fitMapToBounds(geoJSON.geometry.coordinates[0]);
    });
  };

  const onSelectField = (field) => {
    setSelectedField(field);
    setNewFieldName(field.name || `Поле ${field.id.slice(0, 8)}`);
    if (mapRef.current && field.geometry.geometry) {
      fitMapToBounds(field.geometry.geometry.coordinates[0]);
    }
  };

  const fitMapToBounds = (coordinates) => {
    if (mapRef.current) {
      const bounds = L.latLngBounds(
        coordinates.map((coord) => [coord[1], coord[0]])
      );
      mapRef.current.fitBounds(bounds);
    }
  };

  const swapCoordinates = (coordinates) => {
    return coordinates.map((coord) => [coord[1], coord[0]]);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="bg-white shadow-lg rounded-lg p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Ваши поля
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-2">Список полей</h3>
              <div className="space-y-2">
                {fields.map((field) => (
                  <Button
                    key={field.id}
                    onClick={() => onSelectField(field)}
                    variant={
                      selectedField?.id === field.id ? "default" : "outline"
                    }
                    className="w-full justify-start"
                  >
                    {field.name || `Поле ${field.id.slice(0, 8)}`}
                  </Button>
                ))}
              </div>
              <Button
                onClick={() => {
                  setSelectedField(null);
                  setNewFieldName("");
                }}
                variant="outline"
                className="w-full mt-2"
              >
                Новое поле
              </Button>
            </div>
            <div className="col-span-2">
              <div className="h-96 w-full rounded-lg overflow-hidden mb-4">
                <MapContainer
                  center={[44.8524, 65.5022]} // Центр на Кызылорде
                  zoom={7}
                  scrollWheelZoom={true}
                  style={{ height: "100%", width: "100%" }}
                  ref={mapRef}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <FeatureGroup>
                    <EditablePolygon
                      positions={
                        selectedField?.geometry?.geometry?.coordinates[0]
                          ? swapCoordinates(
                              selectedField.geometry.geometry.coordinates[0]
                            )
                          : []
                      }
                      onCreated={onFieldCreated}
                      onEdited={onFieldEdited}
                    />
                  </FeatureGroup>
                </MapContainer>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Input
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              placeholder="Название поля"
              className="flex-grow"
            />
            <Button onClick={onSaveField} variant="default">
              Сохранить поле
            </Button>
            {selectedField && selectedField.id && (
              <Button
                onClick={() =>
                  router.push(`/dashboard/field/${selectedField.id}`)
                }
                variant="outline"
              >
                Посмотреть аналитику
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FieldSelectionPage;
