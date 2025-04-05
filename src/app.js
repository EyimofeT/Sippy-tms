import express from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import morgan from "morgan";
import {format_request_middleware} from "./core/format_request_body.js"
import { getenv } from './core/read_env.js';
import auth_router from "./apis/auth/routes.js"
import user_router from "./apis/user/routes.js"
import task_router from "./apis/task/routes.js"

const app = express();

// set security HTTP headers
app.use(helmet());

// Logging middleware to log to CLI
app.use(morgan("combined"));

// parse json request body
app.use(express.json({ limit: '5mb' }));

// sanitize request data
app.use(xss());

// enable CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, Accept, X-Requested-With, Content-Type');

    next();
});

app.use(format_request_middleware)

let base_route = `/api/v1/`
app.use(`${base_route}auth`,auth_router);
app.use(`${base_route}user`,user_router);
app.use(`${base_route}task`,task_router);

app.get("/", (req, res) => {
  return res.status(200).json({
    code: 200,
    status: "success",
    message: 'Service up and running',
    update : getenv('LAST_UPDATE')
  }); 
})

// Catch-all route for non-existing endpoints
app.use((req, res) => {
    return res.status(404).json({
      code: 404,
      response_code : "99",
      status: "failed",
      message: 'Endpoint not found',
      error: "An Error Occured!",
    });
  });

export default app;