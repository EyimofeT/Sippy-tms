import { getenv } from "../../core/read_env.js";
import { is_token_valid } from "../auth/util.js";
import { read_all_user, read_leaderboard_data, read_user_by_user_id } from "./crud.js";
import { clean_user_object } from "./util.js";

export const view_user = async (req, res) => {
  try {

    let token = req.headers.authorization;
    token = token.split(" ")[1];

    let token_data = await is_token_valid(token)
    if (!token_data) throw new custom_error(`Access denied`, "16")

    let user = await read_user_by_user_id(token_data.user_id)
    if (!user) throw new custom_error("Account not found", "10")

    user = clean_user_object(user)

    return res.status(200).json({
      code: 200,
      response_code: "00",
      status: "success",
      message: `User fetched successfully`,
      data: {
        user,
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

export const view_all_user = async (req, res) => {
  try {

    let token = req.headers.authorization;
    token = token.split(" ")[1];
    let token_data = await is_token_valid(token)
    if (!token_data) throw new custom_error(`Access denied`, "16")


    let user = await read_user_by_user_id(token_data.user_id)
    if (!user) throw new custom_error("Account not found", "10")

    let users = await read_all_user()

    if (users.length > 1) for (user of users) user = clean_user_object(user)


    return res.status(200).json({
      code: 200,
      response_code: "00",
      status: "success",
      message: `Users fetched successfully`,
      data: {
        users,
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

export const view_leaderboard = async (req, res) => {
  try {

    let token = req.headers.authorization;
    token = token.split(" ")[1];

    let token_data = await is_token_valid(token)
    if (!token_data) throw new custom_error(`Access denied`, "16")

    let user = await read_user_by_user_id(token_data.user_id)
    if (!user) throw new custom_error("Account not found", "10")

    let leaderboard_data = await read_leaderboard_data()
    if (!leaderboard_data) throw new custom_error("Something went wrong", "09")


    const leaderboard = leaderboard_data.map(user => {
      const created_tasks = user.tasks;
      const assigned_tasks = user.assignments.map(a => a.task);

      const all_tasks = [...created_tasks, ...assigned_tasks];

      const total_tasks = all_tasks.length;
      const completed_tasks = all_tasks.filter(task => task.status === 'completed').length;

      return {
        user_id: user.user_id,
        name: `${user.first_name} ${user.last_name}`,
        total_tasks,
        completed_tasks,
      };
    });

    leaderboard.sort((a, b) => {
      if (b.completed_tasks !== a.completed_tasks) {
        return b.completed_tasks - a.completed_tasks;
      }
      return a.total_tasks - b.total_tasks;
    });

    return res.status(200).json({
      code: 200,
      response_code: "00",
      status: "success",
      message: `Leaderboard generated successfully`,
      data: {
        leaderboard
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