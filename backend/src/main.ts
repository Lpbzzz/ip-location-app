import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // 启用CORS
  const corsOrigins = process.env.NODE_ENV === 'production'
    ? ['https://*.vercel.app', 'https://your-domain.com'] // 生产环境域名
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:3000'];
    
  app.enableCors({
    origin: corsOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

// Vercel 部署支持
if (process.env.VERCEL) {
  // 导出 Vercel serverless 函数
  let app: NestExpressApplication;
  
  const handler = async (req: any, res: any) => {
    if (!app) {
      app = await NestFactory.create<NestExpressApplication>(AppModule);
      
      // 启用CORS
      const corsOrigins = process.env.NODE_ENV === 'production'
        ? ['https://*.vercel.app', 'https://your-domain.com'] // 生产环境域名
        : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:3000'];
        
      app.enableCors({
        origin: corsOrigins,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
      });
      
      await app.init();
    }
    
    return app.getHttpAdapter().getInstance()(req, res);
  };
  
  module.exports = handler;
  module.exports.default = handler;
} else {
  bootstrap();
}
