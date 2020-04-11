import { exec } from '@actions/exec'
import { ExecOptions } from '@actions/exec/lib/interfaces';
import * as core from '@actions/core'


export async function getChangesIntroducedByTag(tag: string): Promise<string> {
    const previousVersionTag = await getPreviousVersionTag(tag);

    return previousVersionTag
        ? getCommitMessagesBetween(previousVersionTag, tag)
        : getCommitMessagesFrom(tag)

}

async function getPreviousVersionTag(tag: String): Promise<string | null> {
    let previousTag = ''

    const options: ExecOptions = {
        listeners:{
            stdout: (data: Buffer) => {
                previousTag += data.toString()
            },
        },
        silent: true,
        ignoreReturnCode: true
    }

    const exitCode = await exec(
        'git',
        ['describe',
         '--match', 'v[0-9]*',
         '--abbrev=0', // only pring the tag name
         '--first-parent', // will only search for a current branch
         `${tag}^`],// start looking from a parent of a specified tag
          options)

    core.debug(`The previous version tag is ${previousTag}`)

    return exitCode === 0 ? previousTag.trim(): null

}
 async function getCommitMessagesBetween(
    firstTag: string,
    secondTag: string): Promise<string>{
    let commitMessages = ''
        
        const options: ExecOptions = {
            listeners: {
                stdout: (data: Buffer) => {
                    commitMessages += data.toString();     
                }
            },
            silent: true
        }

    await exec(
        'git',
        ['log',
         '--format=%s', // pring only the first line of the commit message
         `${firstTag}..${secondTag}`],  // filter the commits between tags,
         options);  
         
    core.debug(`The commit messages between ${firstTag} and ${secondTag} are:\n ${commitMessages}`)
    
    return commitMessages.trim();
}

async function getCommitMessagesFrom(
    tag: string): Promise<string>{
        let commitMessages = ''
        
        const options: ExecOptions = {
            listeners: {
                stdout: (data: Buffer) => {
                    commitMessages += data.toString();     
                }
            },
            silent: true
        }

    await exec(
        'git',
        ['log',
         '--format=%s', // pring only the first line of the commit message
         tag],  // filter the commits between tags,
         options);  
         
    core.debug(`The commit messages from ${tag} are:\n ${commitMessages}`)
    
    return commitMessages.trim();
}