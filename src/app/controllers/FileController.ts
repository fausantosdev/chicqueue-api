import { Request, Response, NextFunction } from 'express'

import { FileService } from '../services/FileService' 


class FileController {
    private fileService: FileService

    constructor() {
        this.fileService = new FileService()
    }

    async index(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id ? Number(req.params.id) : null

        //console.log(id)
        let result = null

        try {
            id ? 
                result = await this.fileService.readOne({ id }) :
                result = await this.fileService.read({})
            
            return res.status(200).json({
                status: true,
                data: result,
                message: ''
            })      
        } catch (error: any) {
            next(error)
        }
    }

    async store(req: Request, res: Response, next: NextFunction){  
    }

    async update(req: Request, res: Response, next: NextFunction){
    }

    async remove(req: Request, res: Response, next: NextFunction){
        const { id } = req.params

        try {
            const result = await this.fileService.delete({ id: parseInt(id) })
            
            return res.status(200).json({
                status: true,
                data: !!result,
                message: ''
            })

        } catch (error: any) {
            next(error)
        } 
    }
}

export { FileController }