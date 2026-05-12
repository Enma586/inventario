import { registrarLog } from '../services/index.js';

export const auditLog = (entidad) => {
  return (req, res, next) => {
    res.on('finish', () => {
      const metodosAuditables = ['POST', 'PUT', 'DELETE'];
      if (res.statusCode >= 200 && res.statusCode < 300 && metodosAuditables.includes(req.method)) {
        
        const acciones = { POST: 'CREATE', PUT: 'UPDATE', DELETE: 'DELETE' };
        const detalles = { ...req.body };
        delete detalles.password;

        registrarLog({
          id_usuario: req.user?.id || null,
          accion: acciones[req.method],
          entidad,
          entidad_id: req.params?.id || res.locals?.createdId || null,
          detalles: Object.keys(detalles).length ? detalles : null,
          ip: req.ip,
          navegador: req.headers['user-agent']
        });
      }
    });
    next();
  };
};