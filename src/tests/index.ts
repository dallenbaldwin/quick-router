import express, { json } from 'express';
import { router } from './router';

const testingApp = () => {
  const app = express();
  express();
  app.use(json());
  app.use('/api', router);
  const port = 3000;
  app.listen(port, () => {
    console.log(`Test app listening at http://localhost:${port}/api`);
  });
};

export { testingApp };
