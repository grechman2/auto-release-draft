import * as core from '@actions/core'

export async function run(): Promise<void> {
  try {
      core.setOutput('release-url', 'https://example.com')
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
