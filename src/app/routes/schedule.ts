import { Router } from 'express'

import { ScheduleController } from '../controllers/ScheduleController'

import { checkUserOrIsAdmin } from '../middlewares/auth'

class ScheduleRoutes {
  private readonly router: Router
  private readonly scheduleController: ScheduleController

  constructor () {
    this.router = Router()
    this.scheduleController = new ScheduleController()
  }

  getRoutes () {
    this.router.post('/', checkUserOrIsAdmin, this.scheduleController.store.bind(this.scheduleController))// No contexto do controller

    this.router.get('/:id?', checkUserOrIsAdmin, this.scheduleController.index.bind(this.scheduleController))

    this.router.put('/:id', checkUserOrIsAdmin, this.scheduleController.update.bind(this.scheduleController))

    this.router.delete('/:id', checkUserOrIsAdmin, this.scheduleController.remove.bind(this.scheduleController))

    return this.router
  }
}

export { ScheduleRoutes }
