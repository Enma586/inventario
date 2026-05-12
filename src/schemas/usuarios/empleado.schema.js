/**
 * @file src/schemas/usuarios/empleado.schema.js
 * @description Zod schemas minimalistas para Empleado con soporte para OpenAPI.
 */

import { z } from "zod";
import { paginationSchema } from "../pagination.fields.js";
import { registry } from "../../config/swagger.js";

// ─── Componentes (Esquemas) ──────────────────────────────────────

export const createEmpleadoSchema = z.object({
  nombres: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio.")
    .max(100),
  apellidos: z
    .string()
    .trim()
    .min(1, "Los apellidos son obligatorios.")
    .max(100),
  dui: z
    .string()
    .trim()
    .regex(/^\d{8}-\d$/, "El DUI debe tener el formato ########-#"),
}).openapi('CreateEmpleado');

export const updateEmpleadoSchema = z.object({
  nombres: z.string().trim().min(1).max(100).optional(),
  apellidos: z.string().trim().min(1).max(100).optional(),
  dui: z
    .string()
    .trim()
    .regex(/^\d{8}-\d$/, "El DUI debe tener el formato ########-#")
    .optional(),
}).openapi('UpdateEmpleado');

export const queryEmpleadoSchema = paginationSchema.extend({
  search: z.string().optional(),
}).openapi('QueryEmpleado');

// ─── Documentación de Rutas (Endpoints) ──────────────────────────

registry.registerPath({
  method: 'post',
  path: '/api/empleados',
  tags: ['Empleados'],
  summary: 'Registrar un nuevo empleado',
  security: [{ cookieAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': { schema: createEmpleadoSchema }
      }
    }
  },
  responses: {
    201: {
      description: 'Empleado creado exitosamente',
    },
    400: {
      description: 'Errores de validación en la solicitud',
    },
    409: {
      description: 'Conflicto - El DUI ya está registrado',
    }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/empleados',
  tags: ['Empleados'],
  summary: 'Obtener lista de empleados con soporte para paginación y búsqueda',
  security: [{ cookieAuth: [] }],
  request: {
    query: queryEmpleadoSchema
  },
  responses: {
    200: {
      description: 'Lista de empleados obtenida exitosamente',
    }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/empleados/{id}',
  tags: ['Empleados'],
  summary: 'Obtener los detalles de un empleado por su ID',
  security: [{ cookieAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() })
  },
  responses: {
    200: {
      description: 'Detalles del empleado',
    },
    400: {
      description: 'UUID inválido',
    },
    404: {
      description: 'Empleado no encontrado',
    }
  }
});

registry.registerPath({
  method: 'put',
  path: '/api/empleados/{id}',
  tags: ['Empleados'],
  summary: 'Actualizar los datos de un empleado existente',
  security: [{ cookieAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: {
        'application/json': { schema: updateEmpleadoSchema }
      }
    }
  },
  responses: {
    200: {
      description: 'Empleado actualizado exitosamente',
    },
    400: {
      description: 'Errores de validación o UUID inválido',
    },
    404: {
      description: 'Empleado no encontrado',
    }
  }
});

registry.registerPath({
  method: 'delete',
  path: '/api/empleados/{id}',
  tags: ['Empleados'],
  summary: 'Eliminar un empleado del sistema',
  security: [{ cookieAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() })
  },
  responses: {
    200: {
      description: 'Empleado eliminado exitosamente',
    },
    404: {
      description: 'Empleado no encontrado',
    }
  }
});