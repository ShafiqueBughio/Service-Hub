"use client";

import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import { MdLocationOn } from "react-icons/md";
import "leaflet/dist/leaflet.css";

const fixLeafletIcon = () => {
  if (typeof window === "undefined") return;
  const L = require("leaflet");
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
};

const FitBounds = ({ positions }) => {
  const map = useMap();
  const key = positions.map((p) => p.join(",")).join("|");

  useEffect(() => {
    if (!positions.length) return;
    if (positions.length === 1) {
      map.setView(positions[0], 13);
      return;
    }
    const L = require("leaflet");
    map.fitBounds(L.latLngBounds(positions), { padding: [36, 36], maxZoom: 14 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, key]);

  return null;
};

/**
 * Read-only map that pins all service areas on one map.
 * areas: [{ id?, location, latitude, longitude }]
 */
const ServiceAreasDisplayMap = ({ areas = [] }) => {
  useEffect(() => {
    fixLeafletIcon();
  }, []);

  const withCoords = areas.filter(
    (a) =>
      a?.latitude != null &&
      a?.latitude !== "" &&
      a?.longitude != null &&
      a?.longitude !== "" &&
      !Number.isNaN(Number(a.latitude)) &&
      !Number.isNaN(Number(a.longitude))
  );

  const positions = withCoords.map((a) => [
    Number(a.latitude),
    Number(a.longitude),
  ]);

  if (!areas.length) return null;

  if (!withCoords.length) {
    return (
      <div className="w-full h-48 rounded-xl bg-gray-100 flex flex-col items-center justify-center gap-2">
        <MdLocationOn size={32} className="text-gray-300" />
        <div className="px-4 text-center space-y-1">
          {areas.map((a, i) => (
            <p key={a.id ?? i} className="text-sm text-gray-500">
              {a.location || "—"}
            </p>
          ))}
        </div>
      </div>
    );
  }

  const center = positions[0];

  return (
    <div>
      <div className="w-full h-52 sm:h-60 rounded-xl overflow-hidden border border-gray-200">
        <MapContainer
          center={center}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds positions={positions} />
          {withCoords.map((area, idx) => (
            <Marker
              key={area.id ?? `${area.latitude}-${area.longitude}-${idx}`}
              position={[Number(area.latitude), Number(area.longitude)]}
            >
              {area.location && (
                <Popup>
                  <span className="text-sm">{area.location}</span>
                </Popup>
              )}
            </Marker>
          ))}
        </MapContainer>
      </div>

      <ul className="mt-3 flex flex-col gap-1.5">
        {areas.map((area, i) => (
          <li
            key={area.id ?? i}
            className="flex items-start gap-2 text-sm text-gray-600"
          >
            <MdLocationOn
              size={16}
              className="text-primary shrink-0 mt-0.5"
            />
            <span>{area.location || "—"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceAreasDisplayMap;
