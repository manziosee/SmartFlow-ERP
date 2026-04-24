async function testNonExistent() {
  const baseUrl = "https://smartflow-erp-java.fly.dev/api/v1";
  const res = await fetch(`${baseUrl}/does-not-exist`);
  console.log("Status:", res.status);
}
testNonExistent();
