async function checkNetworkCors() {
  const url = "https://smartflow-erp-java.fly.dev/api/v1/auth/login";
  const origin = "http://172.30.16.1:3000";
  
  console.log(`Checking CORS for origin: ${origin}`);
  const res = await fetch(url, {
    method: "OPTIONS",
    headers: { 
        "Origin": origin,
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type"
    }
  });
  
  console.log("Status:", res.status);
  console.log("Allow-Origin:", res.headers.get("access-control-allow-origin"));
}
checkNetworkCors();
