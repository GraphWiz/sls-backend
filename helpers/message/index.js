import fs from 'fs'
import '../resources/messages'

function getPrompt(type, message) {
    const path = `../resources/messages/${type}.txt`
    let prompt = fs.readFileSync(path)
    return `${prompt} ${message}`
}


export { getPrompt }