async function testInvoicesSlash() {
  const email = "seed_admin_79@smartflow.com";
  const password = "SmartFlow123!";
  const baseUrl = "https://smartflow-erp-java.fly.dev/api/v1";
  
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;

  console.log("Testing Invoices with trailing slash...");
  const res = await fetch(`${baseUrl}/invoices/`, {
    headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    }
  });
  
  console.log("Status:", res.status);
}
testInvoicesSlash();
