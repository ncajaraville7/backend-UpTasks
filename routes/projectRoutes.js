import express from 'express';

import {
  getProjects,
  newProjects,
  getProject,
  editProject,
  deleteProject,
  addCollaborator,
  deleteCollaborator,
  searchCollaborator,
} from '../controllers/projectController.js';

import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.route('/').get(checkAuth, getProjects).post(checkAuth, newProjects);

router
  .route('/:id')
  .get(checkAuth, getProject)
  .put(checkAuth, editProject)
  .delete(checkAuth, deleteProject);

router.post('/collaborators', checkAuth, searchCollaborator);
router.post('/collaborators/:id', checkAuth, addCollaborator);
router.post('/delete-collaborators/:id', checkAuth, deleteCollaborator); //no usamos delete ya que solo es para eliminar un recurso completo

export default router;
