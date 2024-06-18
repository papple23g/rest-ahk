import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors'; // 新增這行

import compile from './routes/compile';
import sendFileBuffer from './sendFileBuffer';

// environment defaults
const PORT = process.env.PORT || 8080;

// expressjs constants
const app = express();

// middleware config
app.use(cors()); // 新增這行，允許所有域名訪問
app.use(bodyParser.text({ type: 'text/plain' }));
app.use(helmet.hidePoweredBy());
app.use(sendFileBuffer);

app.use('/compile', compile.router);

app.get('/status', (req, res) => {
  res.send({ compile: compile.stats() });
});

app.listen(PORT, () => {
  console.log(`Listening on port:${PORT}`);
});

export default app;
