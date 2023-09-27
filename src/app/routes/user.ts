import { Router } from 'express'
import { Multer } from 'multer'

import { upload } from '../../config/multer'

import { UserController } from '../controllers/UserController'
 
import { checkUserOrIsAdmin } from '../middlewares/auth'

class UserRoutes {
    private router: Router
    private userController: UserController
    private upload: Multer

    constructor() {
        this.router = Router()
        this.userController = new UserController()

        this.upload = upload
    }

    getRoutes() {
        this.router.use(this.upload.single('avatar'))

        this.router.post('/', this.userController.store.bind(this.userController))// No contexto do controller

        this.router.get('/:id?', checkUserOrIsAdmin, this.userController.index.bind(this.userController))

        this.router.put('/:id', checkUserOrIsAdmin, this.userController.update.bind(this.userController))

        this.router.delete('/:id', checkUserOrIsAdmin, this.userController.remove.bind(this.userController))

        return this.router    
    }
}

export { UserRoutes }