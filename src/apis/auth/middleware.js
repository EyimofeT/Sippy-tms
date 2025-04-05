import { read_user_by_email } from "../user/crud.js";
import { is_request_empty } from "../util/middleware.js";
import {custom_error} from  "../../core/customerror.js"
// import { getenv } from "../../core/read_env.js";


export const register_middleware = async (req, res, next) => {
    try {
        if (is_request_empty(req, res)) throw new custom_error("Cannot Pass Empty Request","02")
        
        const { first_name, last_name, email, password, role } = req.body;

        if (!email) throw new custom_error("email required", "02")
        if (!first_name) throw new custom_error("first_name required", "02")
        if (!last_name) throw new custom_error("last_name required", "02")
        if (!password) throw new custom_error("password required", "02")

        //validate name
        if (!/^[A-Za-z\s]+$/.test(first_name)) throw new custom_error("Only alphabets and spaces allowed for first name", "04");
        if (!/^[A-Za-z\s]+$/.test(last_name)) throw new custom_error("Only alphabets and spaces allowed for last name", "04");

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) throw new custom_error("Invalid email", "04")

        if(await read_user_by_email(email))throw new custom_error("email attached to another account", "09")
  
        // console.log(req.body)

        if(role != undefined){
            if(!["user", "admin"].includes(req.body.role.toLowerCase())) throw new custom_error("invalid role", "09")
        }
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

export const login_middleware = async (req, res, next) => {
    try {
        if (is_request_empty(req, res)) throw new custom_error("Cannot Pass Empty Request","02")

        const { email,password } = req.body

        if (!email) throw new custom_error("email required", "02")
        if (!password) throw new custom_error("password required", "02")
       
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) throw new custom_error("Invalid email", "04")
       

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

export const authcheck = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token) throw new custom_error("Authentication token required", "05");
        next();
    } catch (err) {
        return res.status(400).json({
            code: 400,
            response_code: err.code,
            status: "failed",
            message: err.message,
            error: "An Error Occured!",
        });
    }
};