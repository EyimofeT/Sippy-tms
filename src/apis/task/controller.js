import Google from "../../api_services/Google/Google.js";
import { is_token_valid } from "../auth/util.js";
import { read_user_by_user_id } from "../user/crud.js";
import { is_user_admin } from "../user/util.js";
import {custom_error} from  "../../core/customerror.js"
import { create_task, delete_task, filter_tasks, read_all_user_tasks, read_user_assigned_tasks, read_user_created_tasks, read_user_task, sort_tasks, update_task } from "./crud.js";


export const create_user_task = async (req, res) => {
    try {
  
        let {
            title,
            assigned_to,
            description,
            status,
            priority,
            due_date,
          } = req.body;

    let token = req.headers.authorization;
    token = token.split(" ")[1];
    let token_data = await is_token_valid(token)
    if (!token_data) throw new custom_error(`Access denied`,"16")

    let user = await read_user_by_user_id(token_data.user_id)
    if (!user)throw new custom_error("Account not found", "10")

    if(!assigned_to || assigned_to == undefined) assigned_to = token_data.user_id
   
    let image_url = await new Google().upload_photo(req.files.image[0],`${token_data.user_id} - task photo `)
    if(!image_url || image_url.error) throw new custom_error("Something went wrong","09")
    image_url = image_url.link
    // image_url = 'https://google.com'


    let task_data =  {
        title,
        description,
        status,
        priority,
        due_date,
        image_url,
        user_id : token_data.user_id,
        assigned_to : assigned_to
    }

    let task = await create_task(task_data)
    if(!task) throw new custom_error("Unable to create task","09")
  
    return res.status(200).json({
    code: 200,
    response_code: "00",
    status: "success",
    message: `Task created successfully`,
    data: {
      task
    },
    });
  
    } catch (err) {
      return res.status(400).json({
        code: 400,
        response_code: err.code,
        status: "failed",
        message: err.message,
        error: "An Error Occured!",
      });
    } finally {
  
    }
  }

  
  export const view_user_created_task = async (req, res) => {
    try {


    let token = req.headers.authorization;
    token = token.split(" ")[1];
    let token_data = await is_token_valid(token)
    if (!token_data) throw new custom_error(`Access denied`,"16")

    let user = await read_user_by_user_id(token_data.user_id)
    if (!user)throw new custom_error("Account not found", "10")

    let tasks = await read_user_created_tasks(user.user_id)
    if(!tasks) throw new custom_error("Something went wrong","09")
    
    return res.status(200).json({
    code: 200,
    response_code: "00",
    status: "success",
    message: `Tasks created fetched successfully`,
    data: {
      tasks
    },
    });
  
    } catch (err) {
      return res.status(400).json({
        code: 400,
        response_code: err.code,
        status: "failed",
        message: err.message,
        error: "An Error Occured!",
      });
    } finally {
  
    }
  }

  
  export const view_all_task = async (req, res) => {
    try {


    let token = req.headers.authorization;
    token = token.split(" ")[1];
    let token_data = await is_token_valid(token)
    if (!token_data) throw new custom_error(`Access denied`,"16")

    let user = await read_user_by_user_id(token_data.user_id)
    if (!user)throw new custom_error("Account not found", "10")

    if(!is_user_admin(user)) throw new custom_error("Not allowed to perform this operation","17")

    let tasks = await read_all_user_tasks()
    if(!tasks) throw new custom_error("Something went wrong","09")
    
    return res.status(200).json({
    code: 200,
    response_code: "00",
    status: "success",
    message: `All Tasks fetched successfully`,
    data: {
      tasks
    },
    });
  
    } catch (err) {
      return res.status(400).json({
        code: 400,
        response_code: err.code,
        status: "failed",
        message: err.message,
        error: "An Error Occured!",
      });
    } finally {
  
    }
  }
  
  export const view_user_assigned_task = async (req, res) => {
    try {


    let token = req.headers.authorization;
    token = token.split(" ")[1];
    let token_data = await is_token_valid(token)
    if (!token_data) throw new custom_error(`Access denied`,"16")

    let user = await read_user_by_user_id(token_data.user_id)
    if (!user)throw new custom_error("Account not found", "10")

    let tasks = await read_user_assigned_tasks(user.user_id)
    if(!tasks) throw new custom_error("Something went wrong","09")
    
    return res.status(200).json({
    code: 200,
    response_code: "00",
    status: "success",
    message: `Tasks assigned fetched successfully`,
    data: {
      tasks
    },
    });
  
    } catch (err) {
      return res.status(400).json({
        code: 400,
        response_code: err.code,
        status: "failed",
        message: err.message,
        error: "An Error Occured!",
      });
    } finally {
  
    }
  }

  
    export const delete_user_task = async (req, res) => {
      try {
    
      let token = req.headers.authorization;
      token = token.split(" ")[1];
      let token_data = await is_token_valid(token)
      if (!token_data) throw new custom_error(`Access denied`,"16")
  
      const {task_id} = req.query
  
      let user = await read_user_by_user_id(token_data.user_id)
      if (!user)throw new custom_error("Account not found", "10")
  
      let task = await read_user_task(user.user_id, task_id)
      if(!task) throw new custom_error("Unable to find associated task", "09")

      if(task.user.user_id != user.user_id && !is_user_admin(user)) throw new custom_error("Not allowed to perform this operation","17")
      
      if(!await delete_task(user.user_id, task_id)) throw new custom_error("Something went wrong while trying to delete task", "09")
  
      return res.status(200).json({
      code: 200,
      response_code: "00",
      status: "success",
      message: `Task deleted successfully`,
      data: {
        task
      },
      });
    
      } catch (err) {
        return res.status(400).json({
          code: 400,
          response_code: err.code,
          status: "failed",
          message: err.message,
          error: "An Error Occured!",
        });
      } finally {
    
      }
    }

    
    export const update_user_task = async (req, res) => {
      try {
    
      let token = req.headers.authorization;
      token = token.split(" ")[1];
      let token_data = await is_token_valid(token)
      if (!token_data) throw new custom_error(`Access denied`,"16")
  
      const {task_id} = req.query
      const {title,description, status, priority, due_date} = req.body
  
      let user = await read_user_by_user_id(token_data.user_id)
      if (!user)throw new custom_error("Account not found", "10")
  
      let task = await read_user_task(user.user_id, task_id)
      if(!task) throw new custom_error("Unable to find associated task", "09")

      if(title != undefined || description != undefined || priority != undefined || due_date != undefined || req.files.image){
        if(task.user.user_id != user.user_id && !is_user_admin(user)) throw new custom_error("Not allowed to perform this operation","17")
      }
 
      let task_update_data = {
        ...req.body
      }

      if(req.files.image){
        let image_url = await new Google().upload_photo(req.files.image[0],`${token_data.user_id} - task photo `)
        if(!image_url || image_url.error) throw new custom_error("Something went wrong","09")
        task_update_data.image_url = image_url.link
      }

      task = await update_task(task_id, task_update_data)
      if(!task) throw new custom_error("SOmething went wrong, unable to update task", "09")
  
      return res.status(200).json({
      code: 200,
      response_code: "00",
      status: "success",
      message: `Task updated successfully`,
      data: {
        task
      },
      });
    
      } catch (err) {
        return res.status(400).json({
          code: 400,
          response_code: err.code,
          status: "failed",
          message: err.message,
          error: "An Error Occured!",
        });
      } finally {
    
      }
    }

    export const filter_user_task = async (req, res) => {
      try {
  
  
      let token = req.headers.authorization;
      token = token.split(" ")[1];
      let token_data = await is_token_valid(token)
      if (!token_data) throw new custom_error(`Access denied`,"16")
  
      let user = await read_user_by_user_id(token_data.user_id)
      if (!user)throw new custom_error("Account not found", "10")

      let tasks = await filter_tasks(user.user_id, req.query)
      
      return res.status(200).json({
      code: 200,
      response_code: "00",
      status: "success",
      message: `Tasks filtered successfully`,
      data: {
        tasks
      },
      });
    
      } catch (err) {
        return res.status(400).json({
          code: 400,
          response_code: err.code,
          status: "failed",
          message: err.message,
          error: "An Error Occured!",
        });
      } finally {
    
      }
    }
    
    export const sort_user_task = async (req, res) => {
      try {
      let token = req.headers.authorization;
      token = token.split(" ")[1];
      let token_data = await is_token_valid(token)
      if (!token_data) throw new custom_error(`Access denied`,"16")
  
      let user = await read_user_by_user_id(token_data.user_id)
      if (!user)throw new custom_error("Account not found", "10")

      let tasks = await sort_tasks(user.user_id, req.query)
      
      return res.status(200).json({
      code: 200,
      response_code: "00",
      status: "success",
      message: `Tasks sorted successfully`,
      data: {
        tasks
      },
      });
    
      } catch (err) {
        return res.status(400).json({
          code: 400,
          response_code: err.code,
          status: "failed",
          message: err.message,
          error: "An Error Occured!",
        });
      } finally {
    
      }
    }