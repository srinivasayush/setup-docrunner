import { installAndAddToPath } from './install'
import * as core from '@actions/core'

const main = async () => {
    try {
        await installAndAddToPath()
    } catch (error) {
        core.setFailed(error.message)
    }
}

main()
