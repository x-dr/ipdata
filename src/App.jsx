import { useState, useEffect } from 'react';
import { Input, Button, Card, ConfigProvider, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import TencentMapWithHeightToggle from './components/TencentMapWithHeightToggle';
import LeafletMap from './components/LeafletMap';
import './App.css';

function App() {
  const [ipInput, setIpInput] = useState('');
  const [ipData, setIpData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [useLeaflet, setUseLeaflet] = useState(false);

  // 页面加载时获取本地 IP 信息
  useEffect(() => {
    getLocalIPInfo();
  }, []);

  // IPv4 验证
  const isValidIPv4 = (ip) => {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    return ipv4Regex.test(ip);
  };

  // IPv6 验证
  const isValidIPv6 = (ip) => {
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}(?:[0-9a-fA-F]{1,4}|:)|^(?:[0-9a-fA-F]{1,4}:){1,7}:|^(?:[0-9a-fA-F]{1,4}:){1,6}:(?:[0-9a-fA-F]{1,4}|:)|^(?:[0-9a-fA-F]{1,4}:){1,5}(?::(?:[0-9a-fA-F]{1,4}|:)){1,2}|^(?:[0-9a-fA-F]{1,4}:){1,4}(?::(?:[0-9a-fA-F]{1,4}|:)){1,3}|^(?:[0-9a-fA-F]{1,4}:){1,3}(?::(?:[0-9a-fA-F]{1,4}|:)){1,4}|^(?:[0-9a-fA-F]{1,4}:){1,2}(?::(?:[0-9a-fA-F]{1,4}|:)){1,5}|^[0-9a-fA-F]{1,4}:(?::(?:[0-9a-fA-F]{1,4}|:)){1,6}|^(?:[0-9a-fA-F]{1,4}:)?::(?:[0-9a-fA-F]{1,4}:){1,7}|^(?:[0-9a-fA-F]{1,4}:)?::(?:[0-9a-fA-F]{1,4}:){1,6}$/i;
    return ipv6Regex.test(ip);
  };

  // 获取本地 IP 信息
  const getLocalIPInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ip');
      const result = await response.json();
      if (result.geo && result.geo.geo) {
        const data = result.geo.geo;
        const clientIp = result.geo.clientIp;
        setIpInput(clientIp);
        setIpData({
          type: 'local',
          ip: clientIp,
          country: data.countryName,
          region: data.regionName,
          city: data.cityName,
          postalCode: '',
          latitude: data.latitude,
          longitude: data.longitude,
          asn: data.asn,
          asOrganization: data.cisp,
          colo: '',
        });
        setShowMap(true);
        // 判断是否使用 Leaflet (countryCodeAlpha2 不是 CN)
        setUseLeaflet(data.countryCodeAlpha2 !== 'CN');
      } else {
        message.error('获取本地IP信息失败');
      }
    } catch (error) {
      message.error('获取本地IP信息失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 查询 IP 信息
  const getIPInfo = async () => {
    if (!ipInput) {
      message.warning('请输入IP地址');
      return;
    }

    if (!isValidIPv4(ipInput) && !isValidIPv6(ipInput)) {
      message.error('请输入有效的IPv4或IPv6地址');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/ip?ip=${ipInput}`);
      const result = await response.json();

      if (result.success && result.data) {
        const data = result.data;
        setIpData({
          type: 'query',
          ip: data.query,
          hostname: data.reverse || '',
          country: data.country,
          countryCode: data.countryCode,
          region: data.regionName,
          regionCode: data.region,
          city: data.city,
          district: data.district || '',
          continent: data.continent || '',
          continentCode: data.continentCode || '',
          org: data.org,
          as: data.as,
          asname: data.asname,
          isp: data.isp,
          latitude: data.lat,
          longitude: data.lon,
          postal: data.zip || '',
          timezone: data.timezone || '',
          offset: data.offset,
          currency: data.currency || '',
          hosting: data.hosting,
          proxy: data.proxy,
          mobile: data.mobile,
        });

        if (data.lat && data.lon) {
          setShowMap(true);
          // 判断是否使用 Leaflet (countryCode 不是 CN)
          setUseLeaflet(data.countryCode !== 'CN');
        } else {
          setShowMap(false);
        }
      } else {
        message.error(result.error || '无效的IP地址或查询失败');
        setIpData(null);
        setShowMap(false);
      }
    } catch (error) {
      message.error('查询失败: ' + error.message);
      setIpData(null);
      setShowMap(false);
    } finally {
      setLoading(false);
    }
  };



  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1b61c9',
          colorText: '#181d26',
          colorBorder: '#e0e2e6',
          borderRadius: 12,
          fontFamily: "'Haas', -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif",
        },
      }}
    >
    <div className="min-h-screen py-8 px-4" style={{ background: 'var(--theme_surface-light)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="app-card-outer">
          <h1 className="page-title">
            IP数据查询
          </h1>

          {/* 搜索框 */}
          <div className="search-bar">
            <Input
              size="large"
              placeholder="请输入IP地址"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              onPressEnter={getIPInfo}
              className="flex-1"
            />
            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              onClick={getIPInfo}
              loading={loading}
            >
              查询
            </Button>
          </div>

          {/* 查询结果 */}
          {ipData && (
            <Card
              title={ipData.type === 'local' ? '本地IP信息' : 'IP查询结果'}
              className="mb-6 animate-fadeIn"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="data-row">
                  <span className="data-label">IP地址:</span>
                  <span className="data-value">{ipData.ip}</span>
                </div>

                {ipData.type === 'query' && ipData.hostname && (
                  <div className="data-row">
                    <span className="data-label">主机名:</span>
                    <span className="data-value">{ipData.hostname}</span>
                  </div>
                )}

                <div className="data-row">
                  <span className="data-label">国家:</span>
                  <span className="data-value">{ipData.country}</span>
                </div>

                <div className="data-row">
                  <span className="data-label">地区:</span>
                  <span className="data-value">{ipData.region}</span>
                </div>

                <div className="data-row">
                  <span className="data-label">城市:</span>
                  <span className="data-value">{ipData.city}</span>
                </div>

                {ipData.type === 'local' && (
                  <>
                    <div className="data-row">
                      <span className="data-label">邮编:</span>
                      <span className="data-value">{ipData.postalCode}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">ASN:</span>
                      <span className="data-value">{ipData.asn}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">组织:</span>
                      <span className="data-value">{ipData.asOrganization}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">数据中心:</span>
                      <span className="data-value">{ipData.colo}</span>
                    </div>
                  </>
                )}

                {ipData.type === 'query' && (
                  <>
                    {ipData.countryCode && (
                      <div className="data-row">
                        <span className="data-label">国家代码:</span>
                        <span className="data-value">{ipData.countryCode}</span>
                      </div>
                    )}
                    {ipData.regionCode && (
                      <div className="data-row">
                        <span className="data-label">地区代码:</span>
                        <span className="data-value">{ipData.regionCode}</span>
                      </div>
                    )}
                    {ipData.district && (
                      <div className="data-row">
                        <span className="data-label">区/县:</span>
                        <span className="data-value">{ipData.district}</span>
                      </div>
                    )}
                    {ipData.continent && (
                      <div className="data-row">
                        <span className="data-label">大洲:</span>
                        <span className="data-value">{ipData.continent}</span>
                      </div>
                    )}
                    {ipData.continentCode && (
                      <div className="data-row">
                        <span className="data-label">大洲代码:</span>
                        <span className="data-value">{ipData.continentCode}</span>
                      </div>
                    )}
                    {ipData.postal && (
                      <div className="data-row">
                        <span className="data-label">邮编:</span>
                        <span className="data-value">{ipData.postal}</span>
                      </div>
                    )}
                    {ipData.timezone && (
                      <div className="data-row">
                        <span className="data-label">时区:</span>
                        <span className="data-value">{ipData.timezone}</span>
                      </div>
                    )}
                    {ipData.offset !== undefined && (
                      <div className="data-row">
                        <span className="data-label">时区偏移:</span>
                        <span className="data-value">{ipData.offset}</span>
                      </div>
                    )}
                    {ipData.currency && (
                      <div className="data-row">
                        <span className="data-label">货币:</span>
                        <span className="data-value">{ipData.currency}</span>
                      </div>
                    )}
                    {ipData.org && (
                      <div className="data-row">
                        <span className="data-label">组织:</span>
                        <span className="data-value">{ipData.org}</span>
                      </div>
                    )}
                    {ipData.as && (
                      <div className="data-row">
                        <span className="data-label">AS:</span>
                        <span className="data-value">{ipData.as}</span>
                      </div>
                    )}
                    {ipData.asname && (
                      <div className="data-row">
                        <span className="data-label">AS名称:</span>
                        <span className="data-value">{ipData.asname}</span>
                      </div>
                    )}
                    {ipData.isp && (
                      <div className="data-row">
                        <span className="data-label">ISP:</span>
                        <span className="data-value">{ipData.isp}</span>
                      </div>
                    )}
                    {ipData.hosting !== undefined && (
                      <div className="data-row">
                        <span className="data-label">托管服务:</span>
                        <span className="data-value">{ipData.hosting ? '是' : '否'}</span>
                      </div>
                    )}
                    {ipData.proxy !== undefined && (
                      <div className="data-row">
                        <span className="data-label">代理:</span>
                        <span className="data-value">{ipData.proxy ? '是' : '否'}</span>
                      </div>
                    )}
                    {ipData.mobile !== undefined && (
                      <div className="data-row">
                        <span className="data-label">移动网络:</span>
                        <span className="data-value">{ipData.mobile ? '是' : '否'}</span>
                      </div>
                    )}
                  </>
                )}

                <div className="data-row">
                  <span className="data-label">纬度:</span>
                  <span className="data-value">{ipData.latitude}</span>
                </div>

                <div className="data-row">
                  <span className="data-label">经度:</span>
                  <span className="data-value">{ipData.longitude}</span>
                </div>
              </div>
            </Card>
          )}

          {/* 地图 */}
          {showMap && ipData && (
            <div className="animate-fadeIn map-container">
              {useLeaflet ? (
                <LeafletMap
                  latitude={ipData.latitude}
                  longitude={ipData.longitude}
                  locationName={ipData.city ||  ipData.country || 'Location'}
                />
              ) : (
                <TencentMapWithHeightToggle
                  latitude={ipData.latitude}
                  longitude={ipData.longitude}
                  height={100}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    </ConfigProvider>
  );
}

export default App;
