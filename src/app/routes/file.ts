import { Router } from 'express'

import { FileController } from '../controllers/FileController'
 
import { isAdmin } from '../middlewares/auth'

class FileRoutes {
    private router: Router
    private fileController: FileController

    constructor() {
        this.router = Router()
        this.fileController = new FileController()
    }

    getRoutes() {
        this.router.use(isAdmin)

        this.router.get('/:id?', this.fileController.index.bind(this.fileController))

        return this.router    
    }
}

export { FileRoutes }