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

    const zip = zipName()
    const url = `https://github.com/DudeBro249/docrunner/releases/download/${docrunnerVersion}/${zip}`

    core.info(`Downloading Docrunner from ${url}.`)

    const zipPath = await tc.downloadTool(url)
    const extractedFolder = await tc.extractZip(zipPath)

    const newCachedPath = await tc.cacheDir(
        extractedFolder,
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

const zipName: () => string = () => {
    let arch: string
    switch (process.arch) {
        case 'x64':
            arch = 'x86_64'
            break
        default:
            throw new Error(`Unsupported architechture ${process.arch}.`)
    }

    let platform: string
    switch (process.platform) {
        case 'linux':
            platform = 'unknown-linux-gnu'
            break
        case 'darwin':
            platform = 'apple-darwin'
            break
        case 'win32':
            platform = 'pc-windows-msvc'
            break
        default:
            throw new Error(`Unsupported platform ${process.platform}.`)
    }

    return `docrunner-${arch}-${platform}.zip`
}

export { installAndAddToPath }
