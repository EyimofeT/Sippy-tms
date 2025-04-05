import { read_user_by_user_id } from "../user/crud.js";
import { is_request_empty } from "../util/middleware.js";
import { get_start_and_end_of_day } from "./util.js";
import {custom_error} from  "../../core/customerror.js"
import moment from "moment";


export const create_user_task_middleware = async (req, res, next) => {
    try {
        if (is_request_empty(req, res)) throw new custom_error("Cannot Pass Empty Request", "02")

        const {
            title,
            assigned_to,
            description,
            status,
            priority,
            due_date,
        } = req.body;

        if (!title) throw new custom_error("title required", "02")
        if (!description) throw new custom_error("description required", "02")
        if (!status) throw new custom_error("status required", "02")
        if (!priority) throw new custom_error("priority required", "02")
        if (!due_date) throw new custom_error("due_date required", "02")

        if (assigned_to) if (!await read_user_by_user_id(assigned_to)) throw new custom_error("Unable to assign task to invalid/non-existent user", "10")

        //validate date
        let date = due_date
        date = moment(date, 'YYYY-MM-DD HH:mm:ss.SS').toISOString();
        if (!moment(date, moment.ISO_8601, true).isValid()) throw new custom_error("Invalid date format. Use Datetime format.", "04");
        if (new Date(date) < new Date()) throw new custom_error("Choose a future date", "04")
        req.body.due_date = date

        const valid_status = ['to_do', 'in_progress', 'completed'];
        if (!valid_status.includes(status.toLowerCase())) throw new custom_error(`Invalid status. Must be one of: ${valid_status.join(', ')}`, "04");
        req.body.status = status.toLowerCase()


        const valid_priority = ['low', 'medium', 'high'];
        if (!valid_priority.includes(priority.toLowerCase())) throw new custom_error(`Invalid priority. Must be one of: ${valid_priority.join(', ')}.`, "04");
        req.body.priority = priority.toLowerCase()


        if (!req.files || !req.files.image) throw new custom_error("file - image required", "02");

        next();
    }
    catch (err) {
        return res.status(400).json({
            code: 400,
            status: "failed",
            response_code: err.code,
            message: err.message,
            error: "An Error Occured!",
        });
    };
}

export const delete_user_task_middleware = async (req, res, next) => {
    try {
        const { task_id } = req.query
        if (!task_id || task_id == undefined) throw new custom_error("task id required", "02")

        next()
    }
    catch (err) {
        return res.status(400).json({
            code: 400,
            status: "failed",
            response_code: err.code,
            message: err.message,
            error: "An Error Occured!",
        });
    };
}


export const update_user_task_middleware = async (req, res, next) => {
    try {
        if (is_request_empty(req, res)) throw new custom_error("Cannot Pass Empty Request", "02")
        const { task_id } = req.query
        if (!task_id || task_id == undefined) throw new custom_error("task id required", "02")

        const allowed_keys = ["title", "description", "status", "priority", "due_date"];

        req.body = Object.keys(req.body)
            .filter((key) => allowed_keys.includes(key))
            .reduce((acc, key) => {
                acc[key] = typeof req.body[key] === "string" ? req.body[key].toLowerCase() : req.body[key];
                return acc;
            }, {});

        if ("due_date" in req.body) {
            let date = req.body.due_date
            date = moment(date, 'YYYY-MM-DD HH:mm:ss.SS').toISOString();
            if (!moment(date, moment.ISO_8601, true).isValid()) throw new custom_error("Invalid date format. Use Datetime format.", "04");
            if (new Date(date) < new Date()) throw new custom_error("Choose a future date", "04")
        }

        if ("priority" in req.body) {
            let priority = req.body.priority
            const valid_priority = ['low', 'medium', 'high'];
            if (!valid_priority.includes(priority.toLowerCase())) throw new custom_error(`Invalid priority. Must be one of: ${valid_priority.join(', ')}.`, "04");
            req.body.priority = priority.toLowerCase()
        }

        if ("status" in req.body) {
            let status = req.body.status
            const valid_status = ['to_do', 'in_progress', 'completed'];
            if (!valid_status.includes(status.toLowerCase())) throw new custom_error(`Invalid status. Must be one of: ${valid_status.join(', ')}`, "04");
            req.body.status = status.toLowerCase()
        }

        // image_url   String?


        next()
    }
    catch (err) {
        return res.status(400).json({
            code: 400,
            status: "failed",
            response_code: err.code,
            message: err.message,
            error: "An Error Occured!",
        });
    };
}

export const filter_user_task_middleware = async (req, res, next) => {
    try {
        const allowed_keys = ["status", "priority", "due_date"];

        req.query = Object.keys(req.query)
            .filter((key) => allowed_keys.includes(key))
            .reduce((acc, key) => {
                acc[key] = typeof req.query[key] === "string" ? req.query[key].toLowerCase() : req.query[key];
                return acc;
            }, {});

        if ("due_date" in req.query) {
            let date = req.query.due_date
            date = moment(date, 'YYYY-MM-DD HH:mm:ss.SS').toISOString();
            if (!moment(date, moment.ISO_8601, true).isValid()) throw new custom_error("Invalid date format. Use Datetime format.", "04");
            // if (new Date(date) < new Date()) throw new custom_error("Choose a future date", "04")
            req.query.start_date = get_start_and_end_of_day(date).start
            req.query.end_date = get_start_and_end_of_day(date).end
        }

        if ("priority" in req.query) {
            let priority = req.query.priority
            const valid_priority = ['low', 'medium', 'high'];
            if (!valid_priority.includes(priority.toLowerCase())) throw new custom_error(`Invalid priority. Must be one of: ${valid_priority.join(', ')}.`, "04");
            req.query.priority = priority.toLowerCase()
        }

        if ("status" in req.query) {
            let status = req.query.status
            const valid_status = ['to_do', 'in_progress', 'completed'];
            if (!valid_status.includes(status.toLowerCase())) throw new custom_error(`Invalid status. Must be one of: ${valid_status.join(', ')}`, "04");
            req.query.status = status.toLowerCase()
        }
        next()
    }
    catch (err) {
        return res.status(400).json({
            code: 400,
            status: "failed",
            response_code: err.code,
            message: err.message,
            error: "An Error Occured!",
        });
    };
}

export const sort_user_task_middleware = async (req, res, next) => {
    try {
        const allowed_keys = ["priority", "due_date"];

        req.query = Object.keys(req.query)
            .filter((key) => allowed_keys.includes(key))
            .reduce((acc, key) => {
                acc[key] = typeof req.query[key] === "string" ? req.query[key].toLowerCase() : req.query[key];
                return acc;
            }, {});

        if ("due_date" in req.query) {
            let date = req.query.due_date
            date = moment(date, 'YYYY-MM-DD HH:mm:ss.SS').toISOString();
            if (!moment(date, moment.ISO_8601, true).isValid()) throw new custom_error("Invalid date format. Use Datetime format.", "04");
            // if (new Date(date) < new Date()) throw new custom_error("Choose a future date", "04")
            req.query.start_date = get_start_and_end_of_day(date).start
            req.query.end_date = get_start_and_end_of_day(date).end
        }

        if ("priority" in req.query) {
            let priority = req.query.priority
            const valid_priority = ['low', 'medium', 'high'];
            if (!valid_priority.includes(priority.toLowerCase())) throw new custom_error(`Invalid priority. Must be one of: ${valid_priority.join(', ')}.`, "04");
            req.query.priority = priority.toLowerCase()
        }

        next()
    }
    catch (err) {
        return res.status(400).json({
            code: 400,
            status: "failed",
            response_code: err.code,
            message: err.message,
            error: "An Error Occured!",
        });
    };
}
