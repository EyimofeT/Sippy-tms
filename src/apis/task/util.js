export function get_start_and_end_of_day(iso_date_string) {
    const date = new Date(iso_date_string);
  
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
  
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
  
    return { start, end };
  }
  