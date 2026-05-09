import * as UserService from "../../services/index.js";
import { AppError } from "../../utils/AppError.js";

export const findAll = async (req, res, next) => {
  try {
    const result = await UserService.findAllUsuarios(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

export const findById = async (req, res, next) => {
  try {
    const usuario = await UserService.findUsuarioById(req.params.id);
    res.status(200).json({ success: true, data: usuario.toJSON() });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const usuario = await UserService.createUsuario(req.body);
    res.status(201).json({ success: true, data: usuario.toJSON() });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const usuario = await UserService.updateUsuario(req.params.id, req.body);
    res.status(200).json({ success: true, data: usuario.toJSON() });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const usuario = await UserService.removeUsuario(req.params.id);
    res.status(200).json({ success: true, data: usuario });
  } catch (err) {
    next(err);
  }
};
