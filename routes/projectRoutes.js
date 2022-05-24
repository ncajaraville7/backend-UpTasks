import express from 'express';

import {
  getProjects,
  newProjects,
  getProject,
  editProject,
  deleteProject,
  addCollaborator,
  deleteCollaborator,
  getTasks,
} from '../controllers/ProjectController.js';

import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.get('/', checkAuth, getProjects);
router.post('/', checkAuth, newProjects);

router
  .route('/:id')
  .get(checkAuth, getProject)
  .put(checkAuth, editProject)
  .delete(checkAuth, deleteProject);

router.get('/tasks/:id', checkAuth, getTasks);
router.get('/add-collaborator/:id', checkAuth, addCollaborator);
router.get('/delete-collaborator/:id', checkAuth, deleteCollaborator); //no usamos delete ya que solo es para eliminar un recurso completo

export default router;
