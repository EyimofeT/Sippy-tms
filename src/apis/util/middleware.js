export function is_request_empty(req,res){
    if (!req.body || Object.keys(req.body).length < 1) return true
      return false
  }