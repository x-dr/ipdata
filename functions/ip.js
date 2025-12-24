function isValidIP(ip) {
  const ipv4 = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
  const ipv6 = /^(([0-9a-fA-F]{1,4}):){7}([0-9a-fA-F]{1,4})$/;
  return ipv4.test(ip) || ipv6.test(ip);
}

// CORS 响应头配置
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export async function onRequest({ request }) {
  // 处理 CORS 预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    });
  }

  const geo = request.eo;
  let clientIp;

  // 处理 POST 请求获取 IP
  if (request.method === 'POST') {
    try {
      const body = await request.json();
      clientIp = body.ip || geo.clientIp;
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }), 
        { status: 400, headers: CORS_HEADERS }
      );
    }
  } else {
    clientIp = geo.clientIp;
  }

  // 验证 IP 地址
  if (!clientIp || !isValidIP(clientIp)) {
    return new Response(
      JSON.stringify({ error: 'Invalid IP address' }), 
      { status: 400, headers: CORS_HEADERS }
    );
  }

  let mtjson = {};
  let mtlatlng = {};

  try {
    // 获取 IP 位置信息
    const mtres = await fetch(
      `https://apimobile.meituan.com/locate/v2/ip/loc?rgeo=true&ip=${clientIp}`
    );
    
    if (!mtres.ok) {
      throw new Error(`HTTP error! status: ${mtres.status}`);
    }
    
    mtlatlng = await mtres.json();

    // 如果获取到经纬度，继续获取城市信息
    if (mtlatlng?.data?.lat && mtlatlng?.data?.lng) {
      const mtdata = await fetch(
        `https://apimobile.meituan.com/group/v1/city/latlng/${mtlatlng.data.lat},${mtlatlng.data.lng}?tag=0`
      );
      
      if (mtdata.ok) {
        mtjson = await mtdata.json();
      }
    }
  } catch (error) {
    console.error('获取美团城市数据失败：', error);
  }

  const responseData = {
    geo,
    mtlatlng,
    meituan: mtjson,
  };

  return new Response(JSON.stringify(responseData), {
    headers: CORS_HEADERS,
  });
}