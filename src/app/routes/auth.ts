import { Router } from 'express'

import { UserController } from '../controllers/UserController'
import { AuthController } from '../controllers/AuthController'

import { verifyToken } from '../middlewares/auth'

class AuthRoutes {
    private router: Router
    private userController: UserController
    private authController: AuthController
    
    constructor() {
        this.router = Router()
        this.userController = new UserController()
        this.authController = new AuthController()
    }

    getRoutes() {
        this.router.post('/register', this.userController.store.bind(this.userController))
        this.router.post('/login', this.authController.login.bind(this.authController))
        /*routes.post('/forgot-password', AuthController.forgotPassword)
        routes.post('/reset-password', AuthController.resetPassword)

        routes.post('/logout', verifyToken, AuthController.logout)*/
        this.router.post('/token-refresh', verifyToken, this.authController.tokenRefresh.bind(this.authController))

        return this.router
    }
}

export { AuthRoutes }