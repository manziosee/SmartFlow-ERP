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
  if (res.ok) {
    const data = await res.json();
    console.log("Login successful! Role:", data.role);
    console.log("Token:", data.token.substring(0, 20) + "...");
  } else {
    const text = await res.text();
    console.log("Login failed:", text);
  }
}
check();
