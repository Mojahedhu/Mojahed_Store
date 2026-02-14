
import { type NextFunction, type Request, type Response } from "express"
type AsyncHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<unknown>
export const asyncHandler = (fn: AsyncHandler) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await fn(req, res, next)

    } catch (error) {
        next(error)
    }




}

