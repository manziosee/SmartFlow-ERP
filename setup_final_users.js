async function setupUsers() {
  const baseUrl = "https://smartflow-erp-java.fly.dev/api/v1";
  
  const users = [
    { email: "seed_admin_79@smartflow.com", password: "SmartFlow123!" },
    { email: "manziosee3@gmail.com", password: "Osee@12345" }
  ];

  for (const user of users) {
    console.log(`Setting up ${user.email}...`);
    try {
      const res = await fetch(`${baseUrl}/auth/seed-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });
      const data = await res.json();
      console.log(`   Result: ${JSON.stringify(data)}`);
    } catch (e) {
      console.error(`   Error setting up ${user.email}: ${e.message}`);
    }
  }
}

// We'll run this manually after deployment
console.log("Ready to setup users. Run with 'node setup_final_users.js' after deployment finishes.");
setupUsers();
