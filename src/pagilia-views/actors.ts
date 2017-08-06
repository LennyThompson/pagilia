
import {IActor} from "../PagiliaApi";
import {NextFunction, Request, Response} from "express";

export class ActorsView
{
    constructor(protected actorsList: IActor[])
    {
    }

    public render
    (
        req: Request,
        res: Response,
        view: string,
        options?: Object
    )
    {
        //add constants
        res.locals.BASE_URL = "/api/actors";

        res.locals.actors = this.actorsList;

        //render view
        res.render(view, options);
    }
}