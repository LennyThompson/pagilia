
import {IFilm} from "../PagiliaApi";
import {NextFunction, Request, Response} from "express";

export class FilmsView
{
    constructor(protected filmsList: IFilm[])
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
        res.locals.BASE_URL = "/api/films";

        res.locals.films = this.filmsList;

        //render view
        res.render(view, options);
    }
}