import { Router } from 'express';
import { apiReference } from '@scalar/express-api-reference';
import { createProcessSurveyHandler } from '@/handlers/process-survey.js';
import { createListSurveysHandler } from '@/handlers/list-surveys.js';
import { createAuthMiddleware } from '@/middlewares/auth.js';
import { openApiSpec } from '@/config/openapi.js';

export function createRoutes(): Router {
  const router = Router();
  const processSurveyHandler = createProcessSurveyHandler();
  const listSurveysHandler = createListSurveysHandler();
  const authMiddleware = createAuthMiddleware();

  router.get('/api/surveys', (req, res) => listSurveysHandler.handle(req, res));
  router.post('/api/surveys/:source/process', authMiddleware.validate, (req, res) => processSurveyHandler.handle(req, res));

  router.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'capibarismo-survey-extractor',
      timestamp: new Date().toISOString()
    });
  });

  router.use(
    '/api/docs',
    apiReference({
      spec: {
        content: openApiSpec
      }
    })
  );

  return router;
}
