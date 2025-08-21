// using import alias @/ --> /src/* for deeply nested paths
require("module-alias/register");

const app = require("./app.js");

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
