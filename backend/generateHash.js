const bcrypt = require("bcryptjs");

async function generate() {
  const hash = await bcrypt.hash("admin1234", 10);

  console.log(hash);
}

generate();
