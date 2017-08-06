import * as express from "express";
import * as when from "when";
import {Pool} from "pg";
import * as lodash from "lodash";
import {ActorsView} from "./pagilia-views/actors";
import {ActorView} from "./pagilia-views/actor";

export interface IFilmBase
{
    film_id: number;
    title: string;
    description: string;
    release_year: number;
}

export interface IActor
{
    actor_id: number;
    first_name: string;
    last_name: string;
    last_update: Date;
    films?: IFilmBase[];
}

export interface IFilm extends IFilmBase
{
    language_id: number;
    original_language_id: number;
    rental_duration: number;
    rental_rate: string;
    length: number;
    replacement_cost: string;
    rating: string;
    last_update: Date;
    special_features: string[];
    fulltext: string;
}

export class PagiliaApi
{
    pagiliaDb: Pool;
    constructor()
    {
        this.pagiliaDb = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'pagilia',
            password: 'postgres',
            port: 5432,
        });
    }

    public static registerApi(router: express.Router): void
    {
        let apiPagiliaRouter: PagiliaApi = new PagiliaApi();
        apiPagiliaRouter.create(router);
    }

    create(router: express.Router)
    {
        router.get("/actors",
            (request, response, next) =>
            {
                console.log(request.query);
                if
                (
                    lodash(request.query).isNull()
                    ||
                    lodash(request.query).isEmpty()
                )
                {
                    this.getActors()
                        .then(
                            items => new ActorsView(items).render(request, response, "actors")
                        )
                        .catch(error => response.send(error));
                }
                else
                {
                    this.getActor(request.query.first_name, request.query.last_name)
                        .then(actor => new ActorView(actor).render(request, response, "actor"))
                        .catch(error => response.send(error));
                }
            }
        );
        router.get("/films",
            (request, response, next) =>
            {
                this.getFilms()
                    .then(
                        items => response.send(items)
                    )
                    .catch(error => response.send(error));
            }
        );
    }

    private getActors(): when.Promise<any>
    {
        return when.promise(
            (resolve, reject) =>
            {
                this.pagiliaDb.query("select * from actor order by last_name;")
                    .then(actors =>
                    {
                        if
                        (
                            actors.rows
                            &&
                            actors.rows.length > 0
                        )
                        {
                            resolve(actors.rows);
                        }
                    }
                )
                .catch(error =>
                    {
                        reject(error);
                    }
                );
            }
        );
    }

    private getActor(firstName: string, lastName: string): when.Promise<any>
    {
        return when.promise(
            (resolve, reject) =>
            {

                let data = {first: firstName, last: lastName};
                const templateActor = lodash.template("select " +
                                    "act.actor_id as id, act.first_name as first, act.last_name as last, act.last_update as update, " +
                                    "film.film_id as film_id, film.title as title, film.description as description, film.release_year as release_year " +
                                    "from actor act " +
                                    "inner join film_actor on film_actor.actor_id = act.actor_id " +
                                    "join film film on film.film_id = film_actor.film_id " +
                                    "where act.first_name = '${first}' and act.last_name = '${last}';");
                console.log(templateActor(data));
                this.pagiliaDb.query(templateActor(data))
                    .then(data =>
                        {
                            let actor: IActor = {
                                actor_id: data.rows[0].id,
                                first_name: data.rows[0].first,
                                last_name: data.rows[0].last,
                                last_update: data.rows[0].update,
                                films: lodash(data.rows)
                                    .map((row: any) =>
                                    {
                                        return { film_id: row.film_id, title: row.title, description: row.description, release_year: row.release_year };
                                    })
                                    .value()
                            };
                            resolve(actor);
                        }
                    )
                    .catch(error =>
                        {
                            reject(error);
                        }
                    );
            }
        );
    }

    private getFilms(): when.Promise<any>
    {
        return when.promise(
            (resolve, reject) =>
            {
                this.pagiliaDb.query("select * from film;")
                    .then(films =>
                        {
                            resolve(films);
                        }
                    )
                    .catch(error =>
                        {
                            reject(error);
                        }
                    );
            }
        );
    }

}