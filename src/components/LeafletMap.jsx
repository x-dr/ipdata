import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 修复 Leaflet 默认图标问题
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const LeafletMap = ({ latitude, longitude, locationName = 'Location' }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // 如果地图已存在，先移除
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // 获取地图容器并清理
    const mapContainer = mapRef.current;
    
    // 清空容器内容，确保完全重置
    mapContainer.innerHTML = '';
    
    // 移除 Leaflet 的内部标记
    if (mapContainer._leaflet_id) {
      delete mapContainer._leaflet_id;
    }

    // 创建新地图
    const newMap = L.map(mapContainer).setView([latitude, longitude], 10);

    // 添加地图图层
    L.tileLayer('https://osm.451024.xyz/{z}/{x}/{y}.png', {
      attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(newMap);

    // 添加标记
    L.marker([latitude, longitude])
      .addTo(newMap)
      .bindPopup(`<b>${locationName}</b><br/>纬度: ${latitude}<br/>经度: ${longitude}`)
      .openPopup();

    mapInstanceRef.current = newMap;

    // 清理函数
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, locationName]);

  return (
    <div style={{ position: 'relative', height: '600px' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default LeafletMap;
