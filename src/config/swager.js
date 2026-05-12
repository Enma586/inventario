import swaggerUi from 'swagger-ui-express';
import { OpenAPIRegistry, OpenApiGeneratorV3, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// Extender Zod para habilitar el método .openapi() en todos los esquemas
extendZodWithOpenApi(z);

// Exportar el registro para usarlo en otros archivos
export const registry = new OpenAPIRegistry();

// Función para compilar el documento OpenAPI
const generateOpenApiDocument = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  
  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'API de Inventario',
      description: 'Documentación oficial y contrato de la API REST',
    },
    servers: [{ url: '/' }], // URL base del servidor
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token' // Adaptar al nombre de su cookie de sesión
        }
      }
    }
  });
};

// Función para inyectar la interfaz en Express
export const setupSwagger = (app) => {
  const openApiDocument = generateOpenApiDocument();
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
};