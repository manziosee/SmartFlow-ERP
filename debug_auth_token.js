async function debug() {
  const email = "seed_admin_79@smartflow.com";
  const password = "SmartFlow123!";
  const baseUrl = "https://smartflow-erp-java.fly.dev/api/v1";
  
  console.log("1. Logging in...");
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;
  console.log("Token acquired.");

  console.log("2. Accessing Debug Auth...");
  const debugRes = await fetch(`${baseUrl}/debug/auth`, {
    headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    }
  });
  
  console.log("Status:", debugRes.status);
  const debugData = await debugRes.json();
  console.log("Debug Info:", JSON.stringify(debugData, null, 2));
}
debug();
