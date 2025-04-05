function convert_strings_to_lower_case(obj) {
    const transform_object = (obj) => {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = obj[key].toLowerCase();
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                transform_object(obj[key]);
            }
        }
        return obj;
    };

    return transform_object({ ...obj });
}

function trim_request_body(obj) {
    const trim_object = (obj) => {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = obj[key].trim();
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                trim_object(obj[key]);
            }
        }
        return obj;
    };

    return trim_object({ ...obj }); 
}

export function format_request_middleware(req, res, next) {
    if (req.body) {
        req.body = trim_request_body(req.body);
        // req.body = convert_strings_to_lower_case(req.body); 
    }
    next();
}
