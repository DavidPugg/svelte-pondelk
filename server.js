import express from 'express';
import { handler } from './build/handler.js';

import 'dotenv/config';

const app = express();

app.use(handler);

app.listen(process.env.PORT, () => {
	console.log(`listening on port ${process.env.PORT}`);
});
