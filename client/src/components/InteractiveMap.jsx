import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Layers } from 'lucide-react';

const customPinIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function InteractiveMap({ village, riskMetrics }) {
  if (!village) return null;

  const position = [village.coordinates.lat, village.coordinates.lng];
  const { overallRiskScore, riskCategory, riskBadgeColor } = riskMetrics || {};

  return (
    <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800/80 mb-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
            Interactive Village Spatial Map
          </h3>
          <p className="text-xs text-slate-400">
            Coordinates: {village.coordinates.lat}° N, {village.coordinates.lng}° E • {village.riverBasin}
          </p>
        </div>
        <div className="text-xs self-start sm:self-auto">
          <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-slate-300">
            Agro-Zone: <strong className="text-emerald-400">{village.agroZone.split(' ')[0]}</strong>
          </span>
        </div>
      </div>

      {/* Leaflet Map Box with Mobile responsive height */}
      <div className="h-72 sm:h-96 w-full rounded-xl overflow-hidden border border-slate-800 relative shadow-inner">
        <MapContainer
          center={position}
          zoom={8}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <Circle
            center={position}
            radius={8000}
            pathOptions={{
              color: riskBadgeColor || '#10B981',
              fillColor: riskBadgeColor || '#10B981',
              fillOpacity: 0.2,
              weight: 2
            }}
          />

          <Marker position={position} icon={customPinIcon}>
            <Popup>
              <div className="p-1 max-w-xs font-sans">
                <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1 mb-2">
                  <h4 className="font-bold text-sm text-emerald-400">{village.villageName}</h4>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300">
                    PIN: {village.pincode}
                  </span>
                </div>
                <div className="text-xs space-y-1 text-slate-200">
                  <div>Block: <strong>{village.blockName}</strong></div>
                  <div>District: <strong>{village.districtName}</strong></div>
                  <div>State: <strong>{village.stateName}</strong></div>
                  <div>Primary Crops: <span className="text-emerald-300 font-medium">{village.primaryCrops.join(', ')}</span></div>
                  <div>Risk Category: <span className="font-extrabold" style={{ color: riskBadgeColor }}>{riskCategory} ({overallRiskScore}/100)</span></div>
                </div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Floating Legend */}
        <div className="absolute bottom-2 right-2 z-[1000] glass-panel p-2.5 rounded-xl border border-slate-800 text-[10px] sm:text-[11px] space-y-1 bg-slate-950/90">
          <div className="font-bold text-slate-300 mb-0.5 flex items-center gap-1">
            <Layers className="w-3 h-3 text-emerald-400" /> Legend
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low (&lt;42)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Mod (42-60)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> High (&gt;75)
          </div>
        </div>
      </div>
    </div>
  );
}
