import Project from '../models/Project.js';

/**
 * Obtiene todos los proyectos de la base de datos donde el creador es igual al usuario.*/
const getProjects = async (req, res) => {
  const projects = await Project.find().where('creator').equals(req.user);
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

const getProject = async (req, res) => {
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
  res.json(project);
};

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

const addCollaborator = async (req, res) => {};

const deleteCollaborator = async (req, res) => {};

const getTasks = async (req, res) => {};

export {
  getProjects,
  newProjects,
  getProject,
  editProject,
  deleteProject,
  addCollaborator,
  deleteCollaborator,
  getTasks,
};
