export const errorHandler = (err, req, res, next) => {
    // 1. Error de duplicidad (Unique constraint failed en Sequelize)
    if (err.name === 'SequelizeUniqueConstraintError') {
        const field = err.errors?.[0]?.path || 'campo';
        err.statusCode = 409;
        err.message = `El valor para '${field}' ya existe en la base de datos.`;
    }

    // 2. Error de validación interna de Sequelize
    if (err.name === 'SequelizeValidationError') {
        err.statusCode = 400;
        err.message = err.errors?.[0]?.message || 'Error de validación en la base de datos.';
    }

    // 3. Integración con Zod
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

    // Ocultar el stacktrace en producción por seguridad
    if (process.env.NODE_ENV !== 'production') {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};