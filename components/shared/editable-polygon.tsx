import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export const EditablePolygon = ({ positions, onCreated, onEdited }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const featureGroup = new L.FeatureGroup().addTo(map);

    if (positions.length > 0) {
      const polygon = L.polygon(positions).addTo(featureGroup);
      map.fitBounds(polygon.getBounds());
    }

    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: featureGroup,
      },
      draw: {
        polygon: true,
        polyline: false,
        rectangle: false,
        circle: false,
        circlemarker: false,
        marker: false,
      },
    });

    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, onCreated);
    map.on(L.Draw.Event.EDITED, onEdited);

    return () => {
      map.removeControl(drawControl);
      map.off(L.Draw.Event.CREATED, onCreated);
      map.off(L.Draw.Event.EDITED, onEdited);
    };
  }, [map, positions, onCreated, onEdited]);

  return null;
};
