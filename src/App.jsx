import { useState, useEffect } from 'react';
import { Input, Button, Card, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import TencentMapWithHeightToggle from './components/TencentMapWithHeightToggle';

function App() {
  const [ipInput, setIpInput] = useState('');
  const [ipData, setIpData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

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
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            IP数据查询
          </h1>

          {/* 搜索框 */}
          <div className="flex gap-2 mb-6">
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
                <div className="flex border-b border-gray-200 py-2">
                  <span className="font-semibold text-gray-600 w-32">IP地址:</span>
                  <span className="text-gray-800">{ipData.ip}</span>
                </div>

                {ipData.type === 'query' && ipData.hostname && (
                  <div className="flex border-b border-gray-200 py-2">
                    <span className="font-semibold text-gray-600 w-32">主机名:</span>
                    <span className="text-gray-800">{ipData.hostname}</span>
                  </div>
                )}

                <div className="flex border-b border-gray-200 py-2">
                  <span className="font-semibold text-gray-600 w-32">国家:</span>
                  <span className="text-gray-800">{ipData.country}</span>
                </div>

                <div className="flex border-b border-gray-200 py-2">
                  <span className="font-semibold text-gray-600 w-32">地区:</span>
                  <span className="text-gray-800">{ipData.region}</span>
                </div>

                <div className="flex border-b border-gray-200 py-2">
                  <span className="font-semibold text-gray-600 w-32">城市:</span>
                  <span className="text-gray-800">{ipData.city}</span>
                </div>

                {ipData.type === 'local' && (
                  <>
                    <div className="flex border-b border-gray-200 py-2">
                      <span className="font-semibold text-gray-600 w-32">邮编:</span>
                      <span className="text-gray-800">{ipData.postalCode}</span>
                    </div>
                    <div className="flex border-b border-gray-200 py-2">
                      <span className="font-semibold text-gray-600 w-32">ASN:</span>
                      <span className="text-gray-800">{ipData.asn}</span>
                    </div>
                    <div className="flex border-b border-gray-200 py-2">
                      <span className="font-semibold text-gray-600 w-32">组织:</span>
                      <span className="text-gray-800">{ipData.asOrganization}</span>
                    </div>
                    <div className="flex border-b border-gray-200 py-2">
                      <span className="font-semibold text-gray-600 w-32">数据中心:</span>
                      <span className="text-gray-800">{ipData.colo}</span>
                    </div>
                  </>
                )}

                {ipData.type === 'query' && (
                  <>
                    {ipData.countryCode && (
                      <div className="flex border-b border-gray-200 py-2">
                        <span className="font-semibold text-gray-600 w-32">国家代码:</span>
                        <span className="text-gray-800">{ipData.countryCode}</span>
                      </div>
                    )}
                    {ipData.regionCode && (
                      <div className="flex border-b border-gray-200 py-2">
                        <span className="font-semibold text-gray-600 w-32">地区代码:</span>
                        <span className="text-gray-800">{ipData.regionCode}</span>
                      </div>
                    )}
                    {ipData.district && (
                      <div className="flex border-b border-gray-200 py-2">
                        <span className="font-semibold text-gray-600 w-32">区/县:</span>
                        <span className="text-gray-800">{ipData.district}</span>
                      </div>
                    )}
                    {ipData.continent && (
                      <div className="flex border-b border-gray-200 py-2">
                        <span className="font-semibold text-gray-600 w-32">大洲:</span>
                        <span className="text-gray-800">{ipData.continent}</span>
                      </div>
                    )}
                    {ipData.continentCode && (
                      <div className="flex border-b border-gray-200 py-2">
                        <span className="font-semibold text-gray-600 w-32">大洲代码:</span>
                        <span className="text-gray-800">{ipData.continentCode}</span>
                      </div>
                    )}
                    {ipData.postal && (
                      <div className="flex border-b border-gray-200 py-2">
                        <span className="font-semibold text-gray-600 w-32">邮编:</span>
                        <span className="text-gray-800">{ipData.postal}</span>
                      </div>
                    )}
                    {ipData.timezone && (
                      <div className="flex border-b border-gray-200 py-2">
                        <span className="font-semibold text-gray-600 w-32">时区:</span>
                        <span className="text-gray-800">{ipData.timezone}</span>
                      </div>
                    )}
                    {ipData.offset !== undefined && (
                      <div className="flex border-b border-gray-200 py-2">
                        <span className="font-semibold text-gray-600 w-32">时区偏移:</span>
                        <span className="text-gray-800">{ipData.offset}</span>
                      </div>
                    )}
                    {ipData.currency && (
                      <div className="flex border-b border-gray-200 py-2">
                        <span className="font-semibold text-gray-600 w-32">货币:</span>
                        <span className="text-gray-800">{ipData.currency}</span>
                      </div>
                    )}
                    {ipData.org && (
                      <div className="flex border-b border-gray-200 py-2">
                        <span className="font-semibold text-gray-600 w-32">组织:</span>
                        <span className="text-gray-800">{ipData.org}</span>
                      </div>
                    )}
                    {ipData.as && (
                      <div className="flex border-b border-gray-200 py-2">
                        <span className="font-semibold text-gray-600 w-32">AS:</span>
                        <span className="text-gray-800">{ipData.as}</span>
                      </div>
                    )}
                    {ipData.asname && (
                      <div className="flex border-b border-gray-200 py-2">
                        <span className="font-semibold text-gray-600 w-32">AS名称:</span>
                        <span className="text-gray-800">{ipData.asname}</span>
                      </div>
                    )}
                    {ipData.isp && (
                      <div className="flex border-b border-gray-200 py-2">
                        <span className="font-semibold text-gray-600 w-32">ISP:</span>
                        <span className="text-gray-800">{ipData.isp}</span>
                      </div>
                    )}
                    {ipData.hosting !== undefined && (
                      <div className="flex border-b border-gray-200 py-2">
                        <span className="font-semibold text-gray-600 w-32">托管服务:</span>
                        <span className="text-gray-800">{ipData.hosting ? '是' : '否'}</span>
                      </div>
                    )}
                    {ipData.proxy !== undefined && (
                      <div className="flex border-b border-gray-200 py-2">
                        <span className="font-semibold text-gray-600 w-32">代理:</span>
                        <span className="text-gray-800">{ipData.proxy ? '是' : '否'}</span>
                      </div>
                    )}
                    {ipData.mobile !== undefined && (
                      <div className="flex border-b border-gray-200 py-2">
                        <span className="font-semibold text-gray-600 w-32">移动网络:</span>
                        <span className="text-gray-800">{ipData.mobile ? '是' : '否'}</span>
                      </div>
                    )}
                  </>
                )}

                <div className="flex border-b border-gray-200 py-2">
                  <span className="font-semibold text-gray-600 w-32">纬度:</span>
                  <span className="text-gray-800">{ipData.latitude}</span>
                </div>

                <div className="flex border-b border-gray-200 py-2">
                  <span className="font-semibold text-gray-600 w-32">经度:</span>
                  <span className="text-gray-800">{ipData.longitude}</span>
                </div>
              </div>
            </Card>
          )}

          {/* 地图 */}
          {showMap && ipData && (
            <div className="animate-fadeIn">
              <TencentMapWithHeightToggle
                latitude={ipData.latitude}
                longitude={ipData.longitude}
                height={100}
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default App;
