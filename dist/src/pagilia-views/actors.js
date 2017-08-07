"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ActorsView = (function () {
    function ActorsView(actorsList) {
        this.actorsList = actorsList;
    }
    ActorsView.prototype.render = function (req, res, view, options) {
        //add constants
        res.locals.BASE_URL = "/api/actors";
        res.locals.actors = this.actorsList;
        //render view
        res.render(view, options);
    };
    return ActorsView;
}());
exports.ActorsView = ActorsView;
