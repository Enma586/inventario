import {
  createEmpleado,
  findAllEmpleados,
  findEmpleadoById,
  updateEmpleado,
  removeEmpleado,
} from "../../services/index.js";

export const findAll = async (req, res, next) => {
  try {
    const result = await findAllEmpleados(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

export const findById = async (req, res, next) => {
  try {
    const empleado = await findEmpleadoById(req.params.id);
    res.status(200).json({ success: true, data: empleado.toJSON() });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const empleado = await createEmpleado(req.body);
    res.locals.createdId = empleado.id;
    res.status(201).json({ success: true, data: empleado.toJSON() });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const empleado = await updateEmpleado(req.params.id, req.body);
    res.status(200).json({ success: true, data: empleado.toJSON() });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const empleado = await removeEmpleado(req.params.id);
    res.status(200).json({ success: true, data: empleado });
  } catch (err) {
    next(err);
  }
};
