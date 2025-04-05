// import fs from "fs";
// import path, { dirname } from "path";
import { fileURLToPath } from "url";
// import { dirname } from "path";


import fs from "fs";
import path from "path";

//this function returns the value of the key specified in the env_config.json file
export function getenv(variable) {
  const value = readJSONFile(variable);
return value
}

//this function is the business logic behind getting the value of key specified in the getenv function
// function readJSONFile(key) {
//   // Get the current working directory
//     const currentDirectory = process.cwd();
//   // Navigate upwards by multiple levels
//     const rootDirectory = path.dirname(path.dirname(path.dirname(currentDirectory)));
//     // console.log(process.cwd())

//   try {
//     // __filename=fileURLToPath(import.meta.url)
//     const __dirname=dirname(fileURLToPath(import.meta.url))
    
//     const filePath= path.resolve(__dirname,'..','..','env_config.json')

//     // const filePath = path.join(rootDirectory, "/env_config.json");
//     const fileData = fs.readFileSync(filePath, "utf8");
//     const jsonData = JSON.parse(fileData);

//     // console.log(key)
//     // if(jsonData["ENVIRONMENT"] == 'test' ) key = `${key}_TEST`
//     // console.log(key)
//     return jsonData[key];
//   } catch (error) {
//     console.error("Error reading JSON file:", error);
//     return null;
//   }
// }


/**
 * Reads a key from env_config.json located in the root directory.
 * This version does NOT use `import.meta.url` and works well with Jest.
 */
export function readJSONFile(key) {
  try {
    // Start from the process's current working directory
    const rootDirectory = process.cwd();

    // Point to the file assuming it's in the root of the project
    const filePath = path.resolve(rootDirectory, "env_config.json");

    // Read and parse the JSON config
    const fileData = fs.readFileSync(filePath, "utf8");
    const jsonData = JSON.parse(fileData);

    return jsonData[key];
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return null;
  }
}

