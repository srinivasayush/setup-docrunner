import { installAndAddToPath } from './install'
import * as core from '@actions/core'

const run = async () => {
    try {
        await installAndAddToPath()
    } catch (error: any) {
        core.setFailed(error.message)
    }
}

run()
