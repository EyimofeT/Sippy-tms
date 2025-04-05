// import fs, { link } from 'fs'
import { google } from 'googleapis';
// import path, { dirname } from "path";
import { getenv } from '../../core/read_env.js';
import { fileURLToPath } from "url";
import stream from "stream";
import fs from "fs";
import path from "path";


class Google {
    GOOGLE_DRIVE_PHOTO_UPLOAD_FOLDER_ID

    constructor() {
        console.log("Google Initialized")
        this.GOOGLE_DRIVE_PHOTO_UPLOAD_FOLDER_ID = getenv('GOOGLE_DRIVE_PHOTO_UPLOAD_FOLDER_ID_LIVE')

        if (getenv('ENV').toLowerCase() != 'live') {
            this.GOOGLE_DRIVE_PHOTO_UPLOAD_FOLDER_ID = getenv('GOOGLE_DRIVE_PHOTO_UPLOAD_FOLDER_ID_TEST')
        }
    }

    async get_auth() {
        try {
            // const __dirname = dirname(fileURLToPath(import.meta.url))
            // const filePath = path.resolve(__dirname, '..', '..','..','google_service_key.json')
            // const file = fs.readFileSync(filePath);
            // const credentials = JSON.parse(file);
            // const auth = new google.auth.JWT(
            //     credentials.client_email,
            //     null,
            //     credentials.private_key,
            //     ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
            // );
            // return auth;

            // Use the current working directory to build path to the JSON key
            const rootDirectory = process.cwd();
            const filePath = path.resolve(rootDirectory, "google_service_key.json");

            const file = fs.readFileSync(filePath);
            const credentials = JSON.parse(file);

            const auth = new google.auth.JWT(
                credentials.client_email,
                null,
                credentials.private_key,
                [
                    "https://www.googleapis.com/auth/spreadsheets",
                    "https://www.googleapis.com/auth/drive"
                ]
            );

            return auth;
        }
        catch (err) {
            console.log("Error In get_auth : " + err)
            return false
        }
    }


    async upload_photo(file, name) {

        try {
            const drive = google.drive({ version: 'v3', auth: await this.get_auth() });
            if (!drive) throw new Error

            const b64 = Buffer.from(file.buffer).toString("base64");
            let dataURI = "data:" + file.mimetype + ";base64," + b64;

            const bufferStream = new stream.PassThrough();
            bufferStream.end(file.buffer);

            const media = {
                mimeType: file.mimetype,
                body: bufferStream,
            };

            const driveResponse = await drive.files.create({
                media: media,
                requestBody: {
                    name: name,
                    parents: [this.GOOGLE_DRIVE_PHOTO_UPLOAD_FOLDER_ID],
                },
                fields: "id,name",
            });

            return { error: false, link: `https://lh3.google.com/u/0/d/${driveResponse.data.id}` };
        }

        catch (err) {
            console.log("Error occurred in upload photo to google drive : " + err)
            return { error: true, data: err };
        }

    }
}

export default Google