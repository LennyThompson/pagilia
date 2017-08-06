
import {IActor} from "../PagiliaApi";
import { Request, Response} from "express";

export class ActorView
{
    constructor(protected actor: IActor)
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

        res.locals.actor = this.actor;

        //render view
        res.render(view, options);
    }
}