import express from 'express';

import {
  getProjects,
  newProjects,
  getProject,
  editProject,
  deleteProject,
  addCollaborator,
  deleteCollaborator,
} from '../controllers/projectController.js';

import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.route('/').get(checkAuth, getProjects).post(checkAuth, newProjects);

router
  .route('/:id')
  .get(checkAuth, getProject)
  .put(checkAuth, editProject)
  .delete(checkAuth, deleteProject);

router.post('/add-collaborator/:id', checkAuth, addCollaborator);
router.post('/delete-collaborator/:id', checkAuth, deleteCollaborator); //no usamos delete ya que solo es para eliminar un recurso completo

export default router;
