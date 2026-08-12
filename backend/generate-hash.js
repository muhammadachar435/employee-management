const bcrypt = require("bcryptjs");

const password = "admin123";

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error("❌ Error:", err);
    return;
  }
  console.log('🔑 New hash for "admin123":');
  console.log(hash);
  console.log("\n✅ Copy this hash and update your database!");
});
