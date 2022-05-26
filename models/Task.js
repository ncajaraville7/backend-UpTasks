import mongoose from 'mongoose';

const taskSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    deliveryDate: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    priority: {
      type: String,
      trim: true,
      enum: ['Baja', 'Media', 'Alta'], //permite solo los valores del arreglo
    },
    project: {
      type: mongoose.Schema.Types.ObjectId, //Cuando acceda a los proyectos solo va a traer las tareas de ese proyecto
      ref: 'Project',
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;
