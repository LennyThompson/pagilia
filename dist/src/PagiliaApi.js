"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var when = require("when");
var pg_1 = require("pg");
var lodash = require("lodash");
var actors_1 = require("./pagilia-views/actors");
var actor_1 = require("./pagilia-views/actor");
var films_1 = require("./pagilia-views/films");
var film_1 = require("./pagilia-views/film");
var PagiliaApi = (function () {
    function PagiliaApi() {
        this.pagiliaDb = new pg_1.Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'pagilia',
            password: 'postgres',
            port: 5432,
        });
    }
    PagiliaApi.registerApi = function (router) {
        var apiPagiliaRouter = new PagiliaApi();
        apiPagiliaRouter.create(router);
    };
    PagiliaApi.prototype.create = function (router) {
        var _this = this;
        router.get("/actors", function (request, response, next) {
            console.log(request.query);
            if (lodash(request.query).isNull()
                ||
                    lodash(request.query).isEmpty()) {
                _this.getActors()
                    .then(function (items) { return new actors_1.ActorsView(items).render(request, response, "actors"); })
                    .catch(function (error) { return response.send(error); });
            }
            else {
                _this.getActor(request.query.first_name, request.query.last_name)
                    .then(function (actor) { return new actor_1.ActorView(actor).render(request, response, "actor"); })
                    .catch(function (error) { return response.send(error); });
            }
        });
        router.get("/films", function (request, response, next) {
            if (lodash(request.query).isNull()
                ||
                    lodash(request.query).isEmpty()) {
                _this.getFilms()
                    .then(function (items) { return new films_1.FilmsView(items).render(request, response, "films"); })
                    .catch(function (error) { return response.send(error); });
            }
            else {
                console.log("Getting film " + request.query.film_id);
                _this.getFilm(request.query.film_id)
                    .then(function (film) { return new film_1.FilmView(film).render(request, response, "film"); })
                    .catch(function (error) { return response.send(error); });
            }
        });
    };
    PagiliaApi.prototype.getActors = function () {
        var _this = this;
        return when.promise(function (resolve, reject) {
            _this.pagiliaDb.query("select * from actor order by last_name;")
                .then(function (actors) {
                if (actors.rows
                    &&
                        actors.rows.length > 0) {
                    resolve(actors.rows);
                }
            })
                .catch(function (error) {
                reject(error);
            });
        });
    };
    PagiliaApi.prototype.getActor = function (firstName, lastName) {
        var _this = this;
        return when.promise(function (resolve, reject) {
            var data = { first: firstName, last: lastName };
            var templateActor = lodash.template("select " +
                "act.actor_id as id, act.first_name as first, act.last_name as last, act.last_update as update, " +
                "film.film_id as film_id, film.title as title, film.description as description, film.release_year as release_year " +
                "from actor act " +
                "inner join film_actor on film_actor.actor_id = act.actor_id " +
                "join film film on film.film_id = film_actor.film_id " +
                "where act.first_name = '${first}' and act.last_name = '${last}';");
            console.log(templateActor(data));
            _this.pagiliaDb.query(templateActor(data))
                .then(function (data) {
                var actor = {
                    actor_id: data.rows[0].id,
                    first_name: data.rows[0].first,
                    last_name: data.rows[0].last,
                    last_update: data.rows[0].update,
                    films: lodash(data.rows)
                        .map(function (row) {
                        return { film_id: row.film_id, title: row.title, description: row.description, release_year: row.release_year };
                    })
                        .value()
                };
                resolve(actor);
            })
                .catch(function (error) {
                reject(error);
            });
        });
    };
    PagiliaApi.prototype.getFilms = function () {
        var _this = this;
        return when.promise(function (resolve, reject) {
            _this.pagiliaDb.query("select * from film;")
                .then(function (films) {
                resolve(films.rows);
            })
                .catch(function (error) {
                reject(error);
            });
        });
    };
    PagiliaApi.prototype.getFilm = function (filmId) {
        var _this = this;
        return when.promise(function (resolve, reject) {
            var queryTemplate = lodash.template("select * from film where film_id = ${id};");
            _this.pagiliaDb.query(queryTemplate({ id: filmId }))
                .then(function (film) {
                console.log(film.rows[0]);
                resolve(film.rows[0]);
            })
                .catch(function (error) {
                reject(error);
            });
        });
    };
    return PagiliaApi;
}());
exports.PagiliaApi = PagiliaApi;
