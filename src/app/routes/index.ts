import { Router, Request, Response, NextFunction } from 'express'
import * as Yup from 'yup'

import { AuthRoutes } from './auth'
import { UserRoutes } from './user'
import { FileRoutes } from './file'
import { ScheduleRoutes } from './schedule'

import CustomException from '../../utils/CustomException'

const authRoutes = new AuthRoutes().getRoutes()
const userRoutes = new UserRoutes().getRoutes()
const fileRoutes = new FileRoutes().getRoutes()
const scheduleRoutes = new ScheduleRoutes().getRoutes()

const routes = Router()

routes.use('/auth', authRoutes)
routes.use('/user', userRoutes)
routes.use('/file', fileRoutes)
routes.use('/schedule', scheduleRoutes)

routes.use((err: Error | CustomException, req: Request, res: Response, next: NextFunction) => {
            
    if (err instanceof Error){
        return res.status(400).json({
            status: false,
            data: null,
            message: err instanceof Yup.ValidationError ? err.errors : err.message,
            stack: err.stack
        })
    }

    return res.status(err.code).json({
        status: false,
        data: null,
        message: err.message
    })
})

export default routes