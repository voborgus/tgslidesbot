const {google} = require('googleapis')
const drive = google.drive('v3')

const jwtClient = new google.auth.JWT(
    process.env.google_client_email,
    null,
    process.env.google_private_key,
    ['https://www.googleapis.com/auth/drive'],
    process.env.google_client_email
)

const createFile = async (fileStream, filename, mimeType, folderId) => {
    await drive.files.create({
        auth: jwtClient,
        resource: {
            name: filename,
            mimeType: mimeType,
            parents: [folderId]
        },
        media: {
            mimeType: mimeType,
            body: fileStream
        }
    })
}

async function findOrCreateFolder(name, parentId) {
    console.log(`Looking for %s folder`, name);

    let folderId = null;
    try {
        const searchResult = await drive.files.list({
            auth: jwtClient,
            pageSize: 1,
            fields: 'nextPageToken, files(id, name)',
            q: "name = '" + name + "' and mimeType = 'application/vnd.google-apps.folder' and '" + parentId + "' in parents"
        });
        console.log(`Search results: %s`, JSON.stringify(searchResult.data.files));

        if (searchResult.data.files[0]) {
            folderId = searchResult.data.files[0].id;
        }
    } catch (err) {
        console.log(err)
    }

    if (folderId) {
        console.log(`Folder %s found`, folderId);
        return folderId;
    }

    console.log(`Folder %s not found, going to create one`, name);
    const folder = await drive.files.create({
        auth: jwtClient,
        resource: {
            'name': name,
            'mimeType': 'application/vnd.google-apps.folder',
            parents: [parentId]
        },
        fields: 'id'
    });

    console.log(`Folder %s created, their id: %s`, name, folder.data.id);
    return folder.data.id;
}

async function ensureFolderExists(day, hall) {
    if (!day && !hall) {
        console.log("Will put to the root")
        return process.env.drive_folder_id;
    }

    if (day && hall) {
        console.log("Will put to day/hall folder.")
        const dayFolder = await findOrCreateFolder(day, process.env.drive_folder_id);
        return findOrCreateFolder(hall, dayFolder);
    }

    if (day && !hall) {
        console.log("Will put to day folder.")
        return findOrCreateFolder(day, process.env.drive_folder_id);
    }

    if (!day && hall) {
        console.log("Will put to hall folder.")
        return findOrCreateFolder(hall, process.env.drive_folder_id);
    }
}

const upload = async (fileStream, lastName, firstName, filename, mimeType, day, hall) => {
    const username = lastName || firstName;
    filename = username
        + " - "
        + new Date().toISOString().slice(5, 19).replace(/:/g, "-").replace("T", " ")
        + "."
        + filename.split('.').pop();

    await jwtClient.authorize()
    console.log("Authorized client %s. Going to upload the file.", jwtClient.email)
    const folderId = await ensureFolderExists(day, hall);
    await createFile(fileStream, filename, mimeType, folderId)
}

module.exports = {upload}