import * as tc from '@actions/tool-cache'
import { getVersion } from './version'
import core from '@actions/core'

const installAndAddToPath = async () => {
    const docrunnerVersion = await getVersion()
    let docrunnerLocation = ''

    if (process.platform === 'win32') {
        // windows
        docrunnerLocation = await tc.downloadTool(
            `https://github.com/DudeBro249/docrunner/releases/download/${docrunnerVersion}/docrunner-windows.exe`
        )
    } else if (process.platform === 'darwin') {
        // macOS
        docrunnerLocation = await tc.downloadTool(
            `https://github.com/DudeBro249/docrunner/releases/download/${docrunnerVersion}/docrunner-macOS`
        )
    } else {
        // linux
        docrunnerLocation = await tc.downloadTool(
            `https://github.com/DudeBro249/docrunner/releases/download/${docrunnerVersion}/docrunner-linux`
        )
    }

    if (docrunnerLocation.length > 0) {
        core.addPath(docrunnerLocation)
    }

    return docrunnerLocation
}

export { installAndAddToPath }
