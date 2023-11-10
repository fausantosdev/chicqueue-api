import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

import { promisify } from 'util'

import authConfig from '../../config/auth'

import CustomException from '../../utils/CustomException'

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  try {
    if (!authHeader) throw new CustomException('Token not provided', 401)

    const token = authHeader.split(' ')[1]

    const decoded = await jwt.verify(token, authConfig.secret as string) as JwtPayload

    req.user = decoded.user

    return next()
  } catch (error: any) {
    return res.status(401).json({
      status: false,
      data: null,
      message: error.message
    })
  }
}

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  verifyToken(req, res, () => {
    try {
      if (req.user.type === 'admin') {
        return next()
      } else {
        return res.json({
          status: false,
          data: null,
          message: 'Restricted'
        })
      }
    } catch (err: any) {
      return res.status(401).json({
        status: false,
        data: null,
        message: err.message
      })
    }
  })
}

const checkUserOrIsAdmin = (req: Request, res: Response, next: NextFunction) => {
  verifyToken(req, res, () => {
    try {
      // console.log( typeof Number(req.params.id))
      if (req.user.id === parseInt(req.params.id) || req.user.type === 'admin') {
        return next()
      } else {
        return res.json({
          status: false,
          data: null,
          message: 'Restricted'
        })
      }
    } catch (err: any) {
      return res.status(401).json({
        status: false,
        data: null,
        message: err.message
      })
    }
  })
}

export {
  verifyToken,
  isAdmin,
  checkUserOrIsAdmin
}
