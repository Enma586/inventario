export const errorHandler = (err, req, res, next) => {
    // 1. Error de duplicidad (Unique constraint failed)
    if (err.code === 'P2002') {
        const field = err.meta?.target || 'campo';
        err.statusCode = 409;
        err.message = `El valor para '${field}' ya existe en la base de datos.`;
    }

    // 2. Error de validación de Prisma (Ej. campo requerido faltante)
    if (err.code === 'P2003') {
        err.statusCode = 400;
        err.message = 'Relación no válida: el registro relacionado no existe.';
    }

    // 3. Error de formato (Ej. formato de UUID inválido)
    if (err.code === 'P2023') {
        err.statusCode = 400;
        err.message = 'El ID proporcionado no tiene un formato válido.';
    }

    // 4. Integración con Zod (Si tu error viene del esquema de validación)
    if (err.name === 'ZodError') {
        err.statusCode = 400;
        err.message = 'Error de validación de datos';
        err.details = err.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
        }));
    }

    const statusCode = err.statusCode || 500;
    const response = {
        success: false,
        message: err.message || 'Error interno del servidor',
    };

    if (err.details) {
        response.errors = err.details;
    }

    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};