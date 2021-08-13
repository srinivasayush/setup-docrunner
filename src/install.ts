import { getLatestVersion } from './version'
import * as path from 'path'
import * as os from 'os'
import * as tc from '@actions/tool-cache'
import * as core from '@actions/core'

const installAndAddToPath = async () => {
    const docrunnerVersion = await getLatestVersion()

    const cachedPath = tc.find('docrunner', docrunnerVersion)
    if (cachedPath) {
        core.info(`Using cached Docrunner installation from ${cachedPath}.`)
        core.addPath(cachedPath)
        return
    }

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

    const docrunnerParentFolder = path.dirname(docrunnerLocation)
    core.info(`Docrunner's location is: ${docrunnerLocation}`)
    core.info(`Docrunner's parent folder is: ${docrunnerParentFolder}`)

    const newCachedPath = await tc.cacheDir(
        docrunnerParentFolder,
        'docrunner',
        docrunnerVersion
    )

    core.info(`Cached Docrunner to ${newCachedPath}.`)
    core.addPath(newCachedPath)

    const docrunnerInstallRoot =
        process.env.DOCRUNNER_INSTALL_ROOT ||
        path.join(os.homedir(), '.docrunner', 'bin')
    core.addPath(docrunnerInstallRoot)
}

export { installAndAddToPath }
