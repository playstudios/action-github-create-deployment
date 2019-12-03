import * as core from '@actions/core';
import * as github from '@actions/github';
import { ReposCreateDeploymentParams } from '@octokit/rest'

async function run() {
    let owner = core.getInput('owner');
    let repo = core.getInput('repo');
    let ref = core.getInput('ref');
    let environment = core.getInput('environment');

    core.info(`Deploying ${owner}/${repo}@${ref} to ${environment}`);

    let octokit = new github.GitHub(process.env.GITHUB_TOKEN || '');
    let deploymentResponse = await octokit.repos.createDeployment(<ReposCreateDeploymentParams>{
        owner,
        repo,
        ref,
        environment,

        auto_merge: false,
        required_contexts: <string[]>[],
        payload: core.getInput('payload'),
    });
    if (deploymentResponse.status != 201) {
        core.setFailed(`createDeployment failed with status core ${deploymentResponse.status}`)
    }
}

if (process.env.GITHUB_ACTIONS) {
    run().catch((e) => core.setFailed(e.toString()));
}
