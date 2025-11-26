import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, Monitor, ChevronDown, Check, Play, Pause, RotateCcw, Image, Video, Maximize2, Grid3X3 } from 'lucide-react';

// Echo Show device specifications with accurate resolutions
const ECHO_SHOW_DEVICES = [
  { id: 'echo-show-5', name: 'Echo Show 5', screenSize: '5.5"', width: 960, height: 480, year: '2023' },
  { id: 'echo-show-8-2023', name: 'Echo Show 8', screenSize: '8"', width: 1280, height: 800, year: '2023' },
  { id: 'echo-show-8-2025', name: 'Echo Show 8', screenSize: '8.7"', width: 1280, height: 800, year: '2025' },
  { id: 'echo-show-10', name: 'Echo Show 10', screenSize: '10.1"', width: 1280, height: 800, year: '2023' },
  { id: 'echo-show-15', name: 'Echo Show 15', screenSize: '15.6"', width: 1920, height: 1080, year: '2024' },
  { id: 'echo-show-21', name: 'Echo Show 21', screenSize: '21"', width: 1920, height: 1080, year: '2024' },
];

export default function EchoShowScreenTester() {
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [selectedDevices, setSelectedDevices] = useState(['echo-show-8-2023', 'echo-show-15']);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [scale, setScale] = useState(0.3);
  const fileInputRef = useRef(null);
  const videoRefs = useRef({});
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Cleanup media URL on unmount
  useEffect(() => {
    return () => {
      if (mediaUrl) {
        URL.revokeObjectURL(mediaUrl);
      }
    };
  }, [mediaUrl]);

  // Cleanup video refs when devices are deselected
  useEffect(() => {
    const currentDeviceIds = new Set(selectedDevices);
    Object.keys(videoRefs.current).forEach(deviceId => {
      if (!currentDeviceIds.has(deviceId)) {
        delete videoRefs.current[deviceId];
      }
    });
  }, [selectedDevices]);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith('video/') ? 'video' : 'image';
    setMediaFile(file);
    setMediaType(type);
    setMediaUrl(url);
    setIsPlaying(true);
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      return;
    }
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith('video/') ? 'video' : 'image';
    setMediaFile(file);
    setMediaType(type);
    setMediaUrl(url);
    setIsPlaying(true);
  }, []);

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  // Toggle device selection - Fixed to prevent event bubbling issues
  const toggleDevice = (event, deviceId) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedDevices(prev => {
      if (prev.includes(deviceId)) {
        return prev.filter(id => id !== deviceId);
      } else {
        return [...prev, deviceId];
      }
    });
  };

  const selectAllDevices = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedDevices(ECHO_SHOW_DEVICES.map(d => d.id));
  };

  const clearAllDevices = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedDevices([]);
  };

  const clearMedia = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (mediaUrl) URL.revokeObjectURL(mediaUrl);
    setMediaFile(null);
    setMediaType(null);
    setMediaUrl(null);
  };

  const toggleDropdown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDropdownOpen(prev => !prev);
  };

  const togglePlayPause = () => {
    Object.values(videoRefs.current).forEach(video => {
      if (video) {
        if (isPlaying) {
          video.pause();
        } else {
          video.play().catch(() => {});
        }
      }
    });
    setIsPlaying(!isPlaying);
  };

  const restartVideos = () => {
    Object.values(videoRefs.current).forEach(video => {
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    });
    setIsPlaying(true);
  };

  const selectedDeviceObjects = ECHO_SHOW_DEVICES.filter(d => selectedDevices.includes(d.id));

  const getScaledDimensions = (device) => ({
    width: Math.round(device.width * scale),
    height: Math.round(device.height * scale),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-1">
            Echo Show Screen Tester
          </h1>
          <p className="text-slate-400 text-sm">Test your media across multiple Echo Show screen sizes simultaneously</p>
        </div>

        {/* Controls Panel */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-slate-700/50">
          <div className="flex flex-wrap gap-4 items-start">
            
            {/* Upload Section */}
            <div className="flex-1 min-w-56">
              <label className="block text-sm font-medium text-slate-300 mb-2">Media Upload</label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all
                  ${mediaFile ? 'border-green-500/50 bg-green-500/5' : 'border-slate-600 hover:border-cyan-500/50 hover:bg-cyan-500/5'}`}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input 
                  ref={fileInputRef} 
                  type="file" 
                  accept="image/*,video/*" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
                {mediaFile ? (
                  <div className="flex items-center justify-center gap-2">
                    {mediaType === 'video' ? (
                      <Video className="w-4 h-4 text-green-400 flex-shrink-0" />
                    ) : (
                      <Image className="w-4 h-4 text-green-400 flex-shrink-0" />
                    )}
                    <span className="text-green-400 truncate max-w-40 text-sm">{mediaFile.name}</span>
                    <button 
                      onClick={clearMedia} 
                      className="p-1 hover:bg-red-500/20 rounded-full transition-colors flex-shrink-0"
                    >
                      <X className="w-3 h-3 text-red-400" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 py-1">
                    <Upload className="w-6 h-6 text-slate-500" />
                    <span className="text-slate-400 text-xs">Drop image/video or click</span>
                  </div>
                )}
              </div>
            </div>

            {/* Device Selector - Fixed */}
            <div className="flex-1 min-w-64 relative z-50" ref={dropdownRef}>
              <label className="block text-sm font-medium text-slate-300 mb-2">Select Devices</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={toggleDropdown}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-3 py-2.5 text-left flex items-center justify-between hover:border-cyan-500/50 transition-colors"
                >
                  <span className="text-slate-300 text-sm">
                    {selectedDevices.length === 0 
                      ? 'Select devices...' 
                      : `${selectedDevices.length} device${selectedDevices.length > 1 ? 's' : ''} selected`}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute z-[100] w-full mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl overflow-hidden">
                    {/* Quick Actions */}
                    <div className="flex gap-2 p-2 border-b border-slate-700">
                      <button 
                        type="button"
                        onClick={selectAllDevices} 
                        className="flex-1 text-xs px-2 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
                      >
                        Select All
                      </button>
                      <button 
                        type="button"
                        onClick={clearAllDevices} 
                        className="flex-1 text-xs px-2 py-1.5 bg-slate-600/50 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                    
                    {/* Device List */}
                    <div className="max-h-56 overflow-y-auto">
                      {ECHO_SHOW_DEVICES.map((device) => {
                        const isSelected = selectedDevices.includes(device.id);
                        return (
                          <button
                            key={device.id}
                            type="button"
                            onClick={(e) => toggleDevice(e, device.id)}
                            className={`w-full px-3 py-2.5 flex items-center justify-between hover:bg-slate-700/50 transition-colors
                              ${isSelected ? 'bg-cyan-500/10' : ''}`}
                          >
                            <div className="flex items-center gap-2">
                              <Monitor className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                              <div className="text-left">
                                <div className="font-medium text-slate-200 text-sm">{device.name} ({device.year})</div>
                                <div className="text-xs text-slate-500">{device.screenSize} • {device.width}×{device.height}</div>
                              </div>
                            </div>
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                              ${isSelected ? 'bg-cyan-500 border-cyan-500' : 'border-slate-500'}`}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* View Controls */}
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">View</label>
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => setViewMode('grid')} 
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-cyan-500 text-white' : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600'}`}
                  title="Grid View"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button 
                  type="button"
                  onClick={() => setViewMode('stack')} 
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'stack' ? 'bg-cyan-500 text-white' : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600'}`}
                  title="Stack View"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-1 w-32">
                <label className="text-xs text-slate-400">Scale: {Math.round(scale * 100)}%</label>
                <input 
                  type="range" 
                  min="0.15" 
                  max="1" 
                  step="0.05" 
                  value={scale} 
                  onChange={(e) => setScale(parseFloat(e.target.value))} 
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  aria-label="Preview scale percentage"
                />
              </div>
            </div>

            {/* Video Controls - Only show when video is loaded */}
            {mediaType === 'video' && (
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-slate-300 mb-1">Playback</label>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={togglePlayPause} 
                    className="p-2 bg-slate-700/50 rounded-lg hover:bg-slate-600 transition-colors" 
                    title={isPlaying ? 'Pause All' : 'Play All'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button 
                    type="button"
                    onClick={restartVideos} 
                    className="p-2 bg-slate-700/50 rounded-lg hover:bg-slate-600 transition-colors" 
                    title="Restart All"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Device Previews - Fixed image rendering */}
        {selectedDeviceObjects.length > 0 ? (
          <div className={`${viewMode === 'grid' ? 'flex flex-wrap justify-center gap-6' : 'flex flex-col items-center gap-8'}`}>
            {selectedDeviceObjects.map((device) => {
              const { width, height } = getScaledDimensions(device);
              return (
                <div key={device.id} className="flex flex-col items-center">
                  {/* Device Frame */}
                  <div 
                    className="relative rounded-2xl p-3 shadow-2xl"
                    style={{ 
                      background: 'linear-gradient(145deg, #1a1a2e 0%, #0f0f1a 100%)',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255,255,255,0.05)'
                    }}
                  >
                    {/* Screen */}
                    <div 
                      className="relative rounded-lg overflow-hidden bg-black"
                      style={{ 
                        width: `${width}px`, 
                        height: `${height}px`,
                        minWidth: `${width}px`,
                        minHeight: `${height}px`
                      }}
                    >
                      {mediaUrl ? (
                        mediaType === 'video' ? (
                          <video
                            ref={(el) => { if (el) videoRefs.current[device.id] = el; }}
                            src={mediaUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            onLoadedData={(e) => {
                              e.target.play().catch(() => {});
                            }}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block'
                            }}
                          />
                        ) : (
                          <img
                            src={mediaUrl}
                            alt="Preview"
                            className="w-full h-full object-cover block"
                            onError={(e) => {
                              console.error('Image failed to load:', e);
                            }}
                          />
                        )
                      ) : (
                        <div 
                          className="flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900"
                          style={{ width: '100%', height: '100%' }}
                        >
                          <Monitor className="w-10 h-10 text-slate-600 mb-2" />
                          <span className="text-slate-500 text-xs">No media</span>
                        </div>
                      )}
                      
                      {/* Screen Reflection */}
                      <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 50%)' }}
                      />
                    </div>
                    
                    {/* Camera */}
                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-700 rounded-full">
                      <div className="absolute inset-0.5 bg-slate-600 rounded-full" />
                    </div>
                  </div>
                  
                  {/* Device Info */}
                  <div className="mt-3 text-center">
                    <div className="font-semibold text-slate-200 text-sm">{device.name}</div>
                    <div className="text-xs text-slate-500">{device.screenSize} • {device.width}×{device.height} • {device.year}</div>
                    <div className="text-xs text-cyan-400/70 mt-0.5">Preview: {width}×{height}px</div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500">
            <Monitor className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Select at least one device to preview</p>
          </div>
        )}

        {/* Reference Table */}
        <div className="mt-8 bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
          <h2 className="text-base font-semibold text-slate-200 mb-3">Echo Show Device Reference</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 px-3 text-slate-400 font-medium">Device</th>
                  <th className="text-left py-2 px-3 text-slate-400 font-medium">Screen</th>
                  <th className="text-left py-2 px-3 text-slate-400 font-medium">Resolution</th>
                  <th className="text-left py-2 px-3 text-slate-400 font-medium">Aspect Ratio</th>
                  <th className="text-left py-2 px-3 text-slate-400 font-medium">Year</th>
                </tr>
              </thead>
              <tbody>
                {ECHO_SHOW_DEVICES.map((device) => (
                  <tr key={device.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                    <td className="py-2 px-3 text-slate-200 font-medium">{device.name}</td>
                    <td className="py-2 px-3 text-slate-400">{device.screenSize}</td>
                    <td className="py-2 px-3 text-slate-400">{device.width}×{device.height}</td>
                    <td className="py-2 px-3 text-slate-400">{(device.width / device.height).toFixed(2)}:1</td>
                    <td className="py-2 px-3 text-slate-400">{device.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
