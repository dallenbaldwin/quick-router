import express, { json } from 'express';
import { router } from './router';

const testingApp = () => {
  const app = express();
  express();
  app.use(json());
  app.use('/api', router);
  app.listen(3000, () => {
    console.log('Test app listening at http://localhost:3000/api');
  });
};

export { testingApp };
