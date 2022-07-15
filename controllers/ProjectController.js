import Project from '../models/Project.js';
import User from '../models/User.js';

/**
 * Obtiene todos los proyectos de la base de datos donde el creador es igual al usuario.*/
const getProjects = async (req, res) => {
  const projects = await Project.find({
    $or: [{ collaborators: { $in: req.user } }, { creator: { $in: req.user } }],
  }).select('-tasks');
  res.json(projects);
};

/**
 * Crea un nuevo proyecto y lo guarda en la base de datos. */
const newProjects = async (req, res) => {
  const project = new Project(req.body);
  project.projectCreator = req.user._id;
  try {
    const projectSave = await project.save();
    res.json(projectSave);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Obtiene un proyecto por id, si no se encuentra el proyecto, devuelve un error 404, si se encuentra
 * el proyecto, comprueba si el creador del proyecto es el mismo que el id del usuario, si no lo es,
 * devuelve un error 401 , si lo es, devuelve el proyecto. */
const getProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id)
    .populate('tasks')
    .populate('collaborators', 'name email');

  if (!project) {
    const error = new Error({ msg: 'Proyecto no encontrado' });
    return res.status(404).json({ msg: error.message });
  }

  if (
    project.projectCreator.toString() !== req.user._id.toString() &&
    !project.collaborators.some(
      (collaborator) => collaborator._id.toString() == req.user._id.toString()
    )
  ) {
    const error = new Error({ msg: 'Accion no valida' });
    return res.status(401).json({ msg: error.message });
  }

  res.json(project);
};

/**
 * Toma la identificación del proyecto que se va a editar, encuentra el proyecto en la base de datos,
 * verifica si el usuario es el creador del proyecto y luego actualiza el proyecto con los nuevos
 * datos. */
const editProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) {
    const error = new Error('Proyecto no encontrado');
    return res.status(404).json({ msg: error.message });
  }

  if (project.projectCreator.toString() !== req.user._id.toString()) {
    const error = new Error('Accion no valida');
    return res.status(401).json({ msg: error.message });
  }

  project.name = req.body.name || project.name;
  project.description = req.body.description || project.description;
  project.deliveryDate = req.body.deliveryDate || project.deliveryDate;
  project.client = req.body.client || project.client;

  try {
    const projectSave = await project.save();
    res.json(projectSave);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Elimina un proyecto de la base de datos si el usuario es el creador del proyecto. */
const deleteProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) {
    const error = new Error('Proyecto no encontrado');
    return res.status(404).json({ msg: error.message });
  }

  if (project.projectCreator.toString() !== req.user._id.toString()) {
    const error = new Error('Accion no valida');
    return res.status(401).json({ msg: error.message });
  }

  try {
    await project.deleteOne();
    res.json({ msg: 'Proyecto eliminado' });
  } catch (error) {
    console.log(error);
  }
};

const addCollaborator = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    const error = new Error('Proyecto no encontrado');
    return res.status(404).json({ msg: error.message });
  }

  if (project.projectCreator.toString() !== req.user._id.toString()) {
    const error = new Error('Accion no valida');
    return res.status(404).json({ msg: error.message });
  }

  const { email } = req.body;

  const user = await User.findOne({ email }).select(
    '-confirm -createdAt -password -token -updatedAt -__v'
  );

  if (!user) {
    const error = new Error('Usuario no encontrado');
    return res.status(404).json({ msg: error.message });
  }

  if (project.projectCreator.toString() === user._id.toString()) {
    const error = new Error('El creador del proyecto no puede ser colaborador');
    return res.status(404).json({ msg: error.message });
  }

  if (project.collaborators.includes(user._id)) {
    const error = new Error('El usuario ya pertenece al proyecto');
    return res.status(404).json({ msg: error.message });
  }

  project.collaborators.push(user._id);
  await project.save();
  res.json({ msg: 'Colaborador agregado correctamente' });
};

const searchCollaborator = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email }).select(
    '-confirm -createdAt -password -token -updatedAt -__v'
  );

  if (!user) {
    const error = new Error('Usuario no encontrado');
    return res.status(404).json({ msg: error.message });
  }

  res.json(user);
};

const deleteCollaborator = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    const error = new Error('Proyecto no encontrado');
    return res.status(404).json({ msg: error.message });
  }

  if (project.projectCreator.toString() !== req.user._id.toString()) {
    const error = new Error('Accion no valida');
    return res.status(404).json({ msg: error.message });
  }

  project.collaborators.pull(req.body.id);
  await project.save();
  res.json({ msg: 'Colaborador eliminado correctamente' });
};

export {
  getProjects,
  newProjects,
  getProject,
  editProject,
  deleteProject,
  addCollaborator,
  deleteCollaborator,
  searchCollaborator,
};
