import * as core from '@actions/core';
import * as github from '@actions/github';
import { ReposCreateDeploymentParams } from '@octokit/rest'

async function run() {
    let owner = core.getInput('owner');
    let repo = core.getInput('repo');
    let ref = core.getInput('ref');

    let task = core.getInput('task');
    let environment = core.getInput('environment');
    let application = core.getInput('application');
    let values_file = core.getInput('values_file');
    let key_paths = core.getInput('key_paths');

    core.info(`Deploying ${owner}/${repo}@${ref} to ${environment}`);

    let octokit = new github.GitHub(process.env.GITHUB_TOKEN || '');
    let deploymentResponse = await octokit.repos.createDeployment(<ReposCreateDeploymentParams>{
        owner,
        repo,
        ref,

        auto_merge: false,
        required_contexts: <string[]>[],

        task,
        environment,

        payload: JSON.stringify({
            application,
            values_file,
            key_paths,
        }, (_, value: any) => value == '' ? undefined : value),
    });
    if (deploymentResponse.status != 201) {
        core.setFailed(`createDeployment failed with status core ${deploymentResponse.status}`)
    }
}

if (process.env.GITHUB_ACTIONS) {
    run().catch((e) => core.setFailed(e.toString()));
}
