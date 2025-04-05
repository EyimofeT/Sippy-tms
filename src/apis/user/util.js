export function clean_user_object(user){
    delete user.password

    return user
}

export function is_user_admin(user){
    return (user.role == 'admin')
}