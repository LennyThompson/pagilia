
import { IFilm} from "../PagiliaApi";
import { Request, Response} from "express";

export class FilmView
{
    constructor(protected film: IFilm)
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
        res.locals.BASE_URL = "/api/film";

        res.locals.film = this.film;

        //render view
        res.render(view, options);
    }
}