async function check() {
  const email = "seed_admin_79@smartflow.com";
  const password = "SmartFlow123!";
  const url = "https://smartflow-erp-java.fly.dev/api/v1/auth/login";
  
  console.log(`Checking login for ${email}...`);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  
  console.log("Status:", res.status);
  const data = await res.json();
  console.log("Body:", JSON.stringify(data, null, 2));
}
check();
