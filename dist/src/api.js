"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var when = require("when");
var PagiliaApi_1 = require("./PagiliaApi");
var superAgent = require("superagent");
var xmlParser = require("superagent-xml2jsparser");
var ApiRouter = (function () {
    function ApiRouter() {
    }
    ApiRouter.registerApi = function (app) {
        var router = express.Router();
        var apiRouter = new ApiRouter();
        //IndexRoute
        apiRouter.create(app, router);
    };
    ApiRouter.prototype.create = function (app, router) {
        var _this = this;
        router.get("/", function (request, response, next) {
            _this.getNews()
                .then(function (json) {
                console.log("response: ", json);
                response.send(json);
            })
                .catch(function (error) { return response.json = error; });
        });
        PagiliaApi_1.PagiliaApi.registerApi(router);
        //use router middleware
        app.use("/api", router);
    };
    ApiRouter.prototype.getNews = function () {
        console.log("getNews", xmlParser);
        return when.promise(function (resolve, reject) {
            superAgent.get("http://www.news.com.au/rss")
                .accept("xml")
                .buffer(true)
                .parse(xmlParser)
                .end(function (error, response) {
                if (error) {
                    console.log("error", error);
                    reject(error);
                }
                else {
                    console.log("rss response: ", JSON.stringify(response.body));
                    resolve(response.body);
                }
            });
        });
    };
    return ApiRouter;
}());
exports.ApiRouter = ApiRouter;
