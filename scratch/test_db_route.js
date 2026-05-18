async function run() {
  try {
    console.log("Checking http://localhost:3005/api/db-test...");
    const res = await fetch("http://localhost:3005/api/db-test");
    console.log("Status:", res.status);
    const body = await res.json();
    console.log("Body:", body);
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}
run();
