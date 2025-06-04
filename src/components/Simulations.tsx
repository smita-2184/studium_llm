import React, { useState } from 'react';
import { Maximize2, Minimize2, RefreshCw } from 'lucide-react';

const SIMULATIONS = [
  {
    id: 'compare-pendulum',
    title: 'Compare Pendulums',
    url: 'https://www.myphysicslab.com/pendulum/compare-pendulum-en.html'
  },
  {
    id: 'pendulum',
    title: 'Pendulum Lab',
    url: 'https://phet.colorado.edu/sims/html/pendulum-lab/latest/pendulum-lab_en.html'
  },
  {
    id: 'forces',
    title: 'Forces and Motion',
    url: 'https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_en.html'
  },
  {
    id: 'energy',
    title: 'Energy Forms and Changes',
    url: 'https://phet.colorado.edu/sims/html/energy-forms-and-changes/latest/energy-forms-and-changes_en.html'
  },
  {
    id: 'waves',
    title: 'Wave Interference',
    url: 'https://phet.colorado.edu/sims/html/wave-interference/latest/wave-interference_en.html'
  },
  {
    id: 'gravity',
    title: 'Gravity and Orbits',
    url: 'https://phet.colorado.edu/sims/html/gravity-and-orbits/latest/gravity-and-orbits_en.html'
  }
];

export function Simulations() {
  const [currentSim, setCurrentSim] = useState(SIMULATIONS[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className={`h-full flex flex-col bg-[#2C2C2E] rounded-lg ${
      isFullscreen ? 'fixed inset-4 z-50' : ''
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#1C1C1E] rounded-t-lg">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-medium">Physics Simulations</h2>
          <select
            value={currentSim.id}
            onChange={(e) => setCurrentSim(SIMULATIONS.find(sim => sim.id === e.target.value) || SIMULATIONS[0])}
            className="bg-[#3A3A3C] text-white px-3 py-1.5 rounded-lg text-sm"
          >
            {SIMULATIONS.map(sim => (
              <option key={sim.id} value={sim.id}>
                {sim.title}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.location.reload()}
            className="p-2 rounded-lg hover:bg-[#3A3A3C] transition-colors"
            title="Refresh simulation"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg hover:bg-[#3A3A3C] transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Simulation iframe */}
      <div className="flex-1 bg-[#1C1C1E] p-4">
        <div className="w-full h-full bg-white rounded-lg overflow-hidden">
          <iframe 
            src={currentSim.url}
            className="w-full h-full"
            title={currentSim.title}
            frameBorder="0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            loading="lazy"
          />
        </div>
      </div>

      {/* Footer */}
      {isFullscreen && (
        <div className="p-2 bg-[#1C1C1E] rounded-b-lg text-xs text-gray-500 text-center">
          Press Esc to exit fullscreen
        </div>
      )}
    </div>
  );
}