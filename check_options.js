async function checkOptions() {
  const url = "https://smartflow-erp-java.fly.dev/api/v1/auth/login";
  console.log(`Checking OPTIONS for ${url}...`);
  const res = await fetch(url, {
    method: "OPTIONS",
    headers: { 
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type"
    }
  });
  console.log("Status:", res.status);
  console.log("Headers:", [...res.headers.entries()]);
}
checkOptions();
