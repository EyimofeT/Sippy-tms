import { PrismaClient } from "@prisma/client";
import { getenv } from "../../core/read_env.js";
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: getenv("DATABASE_URL"),
        },
    },
});
const transaction_timeout = 200000

let task_object = {
    task_id: true,
    title: true,
    description: true,
    status: true,
    due_date: true,
    image_url: true,
    created_at: true,
    updated_at: true,
    user: {
        select: {
            user_id: true,
            first_name: true,
            last_name: true,
            email: true,
            role: true
        }
    },
    assignments: {
        select: {
            assigned_to: true,
            assigned_at: true,
            user: {
                select: {
                    user_id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    role: true
                }
            }
        }
    }
}

export async function create_task(task_data) {
    try {
        let task, task_assignment
        let {
            title,
            description,
            status,
            priority,
            due_date,
            image_url,
            user_id,
            assigned_to
        } = task_data

        await prisma.$transaction(async (tx) => {

            task = await tx.task.create({
                data: {
                    title: title.toLowerCase(),
                    description: description.toLowerCase(),
                    status,
                    priority,
                    due_date,
                    image_url,
                    user_id
                }
            })

            task_assignment = await tx.task_assignment.create({
                data: {
                    task_id: task.task_id,
                    assigned_to
                }
            })

        }, { timeout: transaction_timeout, isolationLevel: 'Serializable' });

        return { task, task_assignment }
    } catch (err) {
        console.log("Something went wrong in create_task : " + err)
        return false;
    } finally {
        await prisma.$disconnect();
    }
}

export async function read_user_created_tasks(user_id) {
    try {
        let tasks = await prisma.task.findMany({
            where: {
                user_id
            },
            select: task_object
        })

        return tasks
    }
    catch (err) {
        console.log("Something went wrong in read_user_created_tasks : " + err)
        return false;
    } finally {
        await prisma.$disconnect();
    }
}

export async function read_user_assigned_tasks(user_id) {
    try {
        let tasks = await prisma.task.findMany({
            where: {
                assignments: {
                    assigned_to: user_id
                }
            },
            select: task_object
        })

        return tasks
    }
    catch (err) {
        console.log("Something went wrong in read_user_assigned_tasks : " + err)
        return false;
    } finally {
        await prisma.$disconnect();
    }
}

export async function read_user_task(user_id, task_id) {
    try {
        let task = await prisma.task.findFirst({
            where: {
                OR: [
                    {
                        AND: [
                            { user_id: user_id },
                            { task_id: Number(task_id) }
                        ]
                    },
                    {
                        assignments: {
                            task_id: Number(task_id),
                            assigned_to: user_id
                        }
                    }
                ]
            },
            select: task_object
        })

        if (!task) return false

        return task
    }
    catch (err) {
        console.log("Something went wrong in read_user_task : " + err)
        return false;
    } finally {
        await prisma.$disconnect();
    }
}

export async function delete_task(user_id, task_id) {
    try {
        let task = await prisma.task.delete({
            where: {
                user_id,
                task_id: Number(task_id)
            },

        })

        if (!task) return false

        return true
    }
    catch (err) {
        console.log("Something went wrong in delete_user_task : " + err)
        return false;
    } finally {
        await prisma.$disconnect();
    }
}

export async function update_task(task_id, update_data) {
    try {
        let task = await prisma.task.update({
            where: {
                task_id: Number(task_id)
            },
            data: update_data

        })

        if (!task) return false

        return task
    }
    catch (err) {
        console.log("Something went wrong in update_task : " + err)
        return false;
    } finally {
        await prisma.$disconnect();
    }
}


export async function read_all_user_tasks() {
    try {
        let tasks = await prisma.task.findMany({
            select: task_object
        })

        return tasks
    }
    catch (err) {
        console.log("Something went wrong in read_all_user_tasks : " + err)
        return false;
    } finally {
        await prisma.$disconnect();
    }
}

export async function filter_tasks(user_id,request_query) {
    try {

        const { status, priority, start_date, end_date } = request_query;

        let tasks = await prisma.task.findMany({
           where : {
                AND: [
                  {
                    ...(status && { status }),
                    ...(priority && { priority }),
                    ...(start_date && end_date && {
                      due_date: {
                        gte: new Date(start_date),
                        lte: new Date(end_date),
                      },
                    }),
                  },
                  {
                    OR: [
                      {
                         user_id: user_id  
                      },
                      {
                        assignments: {
                          assigned_to: user_id
                        }
                      }
                    ]
                  }
                ]
              }
        })
        return tasks
    }

    
    catch (err) {
        console.log("Something went wrong in filter_tasks : " + err)
        return false;
    } finally {
        await prisma.$disconnect();
    }
}

export async function sort_tasks(user_id,request_query) {
    try {

        const {  priority, start_date, end_date } = request_query;

        let tasks = await prisma.task.findMany({
           where : {
                AND: [
                  {
                    ...(priority && { priority }),
                    ...(start_date && end_date && {
                      due_date: {
                        gte: new Date(start_date),
                        lte: new Date(end_date),
                      },
                    }),
                  },
                  {
                    OR: [
                      {
                         user_id: user_id  
                      },
                      {
                        assignments: {
                          assigned_to: user_id
                        }
                      }
                    ]
                  }
                ]
              },
              orderBy: [
                { due_date: 'asc' },    
                { priority: 'desc' }, 
              ]
        })
        return tasks
    }

    
    catch (err) {
        console.log("Something went wrong in filter_tasks : " + err)
        return false;
    } finally {
        await prisma.$disconnect();
    }
}