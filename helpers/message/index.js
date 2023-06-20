import fs from 'fs'
import path from 'path'

const msgsPath = path.resolve(path.dirname(''), 'resources/messages')

function getPrompt(type, message) {
    const filePath = `${msgsPath}/${type}.txt`
    try {
        const prompt = fs.readFileSync(filePath)
        return `${prompt} ${message}`
    } catch (error) {
        console.error("EVENT\n" + JSON.stringify(error, null, 2));
    }
}


export { getPrompt }