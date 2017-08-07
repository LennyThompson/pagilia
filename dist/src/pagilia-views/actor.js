"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ActorView = (function () {
    function ActorView(actor) {
        this.actor = actor;
    }
    ActorView.prototype.render = function (req, res, view, options) {
        //add constants
        res.locals.BASE_URL = "/api/actors";
        res.locals.actor = this.actor;
        //render view
        res.render(view, options);
    };
    return ActorView;
}());
exports.ActorView = ActorView;
