import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend, LineChart, Line } from 'recharts';
import { Calendar, TrendingUp, Thermometer, CloudRain, AlertCircle } from 'lucide-react';

export default function ClimateCharts({ village, riskMetrics }) {
  const [activeChartTab, setActiveChartTab] = useState('history'); // 'history' | 'forecast' | 'breakdown'

  if (!village || !riskMetrics) return null;

  const { historicalTrends, forecastDays, subIndices } = riskMetrics;

  const hazardData = [
    { hazard: 'Drought Index', score: subIndices.droughtIndex, fill: '#F59E0B' },
    { hazard: 'Heat Stress', score: subIndices.heatwaveIndex, fill: '#EF4444' },
    { hazard: 'Flood Inundation', score: subIndices.floodIndex, fill: '#06B6D4' },
    { hazard: 'Pest Outbreak', score: subIndices.pestIndex, fill: '#A855F7' },
    { hazard: 'Soil/GW Stress', score: subIndices.soilIndex, fill: '#10B981' },
  ];

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 mb-6 shadow-xl">
      
      {/* Chart Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Agricultural Climate Analytics & Forecast
          </h3>
          <p className="text-xs text-slate-400">
            Historical 10-year rainfall/temperature anomaly trends vs projected 14-day weather alerts
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveChartTab('history')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeChartTab === 'history'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            10-Yr Historical Trend
          </button>
          <button
            onClick={() => setActiveChartTab('forecast')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeChartTab === 'forecast'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            14-Day Forecast
          </button>
          <button
            onClick={() => setActiveChartTab('breakdown')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeChartTab === 'breakdown'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Hazard Breakdown
          </button>
        </div>
      </div>

      {/* CHART CONTENT */}
      {activeChartTab === 'history' && (
        <div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#64748b" fontSize={11} />
                <YAxis yAxisId="left" stroke="#06B6D4" fontSize={11} unit="mm" />
                <YAxis yAxisId="right" orientation="right" stroke="#EF4444" fontSize={11} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  formatter={(val, name) => [
                    name === 'rainfallMm' ? `${val} mm` : name === 'estimatedCropYieldLossPercent' ? `${val}%` : `${val}°C`,
                    name === 'rainfallMm' ? 'Annual Rainfall' : name === 'estimatedCropYieldLossPercent' ? 'Crop Yield Loss Risk' : 'Temp Anomaly'
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area yAxisId="left" type="monotone" dataKey="rainfallMm" name="Annual Rainfall (mm)" stroke="#06B6D4" fillOpacity={1} fill="url(#colorRain)" strokeWidth={2} />
                <Area yAxisId="right" type="monotone" dataKey="estimatedCropYieldLossPercent" name="Crop Yield Loss Risk (%)" stroke="#EF4444" fillOpacity={1} fill="url(#colorYield)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <span>Normal Baseline Rainfall: <strong className="text-emerald-400">{village.annualRainfallNormal} mm</strong></span>
            <span>Historical Crop Sensitivity: <strong className="text-amber-400">High sensitivity to mid-monsoon dry spells</strong></span>
          </div>
        </div>
      )}

      {activeChartTab === 'forecast' && (
        <div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastDays} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="dayName" stroke="#64748b" fontSize={11} />
                <YAxis yAxisId="temp" stroke="#F59E0B" fontSize={11} unit="°C" domain={[15, 48]} />
                <YAxis yAxisId="precip" orientation="right" stroke="#06B6D4" fontSize={11} unit="%" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line yAxisId="temp" type="monotone" dataKey="maxTempC" name="Max Temp (°C)" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line yAxisId="temp" type="monotone" dataKey="minTempC" name="Min Temp (°C)" stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="3 3" />
                <Line yAxisId="precip" type="monotone" dataKey="precipitationProbPercent" name="Precipitation Prob (%)" stroke="#06B6D4" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Agronomic Alert Ticker */}
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {forecastDays.slice(0, 7).map((f, idx) => (
              <div key={idx} className="bg-slate-900/90 border border-slate-800 p-2 rounded-xl text-center">
                <div className="text-[11px] font-bold text-slate-300">{f.dayName} ({f.date.split('-')[2]})</div>
                <div className="text-xs font-semibold text-rose-400 my-0.5">{f.maxTempC}°C</div>
                <div className="text-[10px] text-cyan-400 font-medium">{f.precipitationProbPercent}% rain</div>
                <div className="text-[9px] font-mono px-1 py-0.5 mt-1 rounded bg-slate-800 text-amber-300 truncate" title={f.agriImpact}>
                  {f.agriImpact}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeChartTab === 'breakdown' && (
        <div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hazardData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={11} unit="%" />
                <YAxis type="category" dataKey="hazard" stroke="#94a3b8" fontSize={12} width={110} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Bar dataKey="score" name="Risk Index (%)" radius={[0, 8, 8, 0]} barSize={24}>
                  {hazardData.map((entry, index) => (
                    <cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-center">
            Weighted composite: Drought (30%) + Heatwave (22%) + Flood (18%) + Pest (15%) + Groundwater/Soil (15%)
          </p>
        </div>
      )}

    </div>
  );
}
