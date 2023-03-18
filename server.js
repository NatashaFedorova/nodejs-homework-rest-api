const app = require('./app');

require('dotenv').config();

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running. Use our API on port: ${port}`);
});
