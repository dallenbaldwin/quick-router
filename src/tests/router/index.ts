import { Success } from '../../constants/successes';
import { QuickRouter } from '../../QuickRouter';

const router = QuickRouter([
  {
    method: 'get',
    endpoint: '/',
    handler: () => ({ message: 'success' }),
    code: Success.ACCEPTED,
  },
  {
    method: 'get',
    endpoint: '/:id',
    handler: async ({ params }) =>
      new Promise((resolve) => {
        setTimeout(() => resolve({ message: `got ${params['id']}` }), 2000);
      }),
  },
]);
export { router };
