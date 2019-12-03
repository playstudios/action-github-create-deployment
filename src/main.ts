import * as core from '@actions/core';
import * as github from '@actions/github';
import { ReposCreateDeploymentParams } from '@octokit/rest'

async function run() {
    let octokit = new github.GitHub(process.env.GITHUB_TOKEN || '');
    let deploymentResponse = await octokit.repos.createDeployment(<ReposCreateDeploymentParams>{
        owner: core.getInput('owner'),
        repo: process.env.GITHUB_REPOSITORY,
        ref: core.getInput('ref'),

        auto_merge: false,
        required_contexts: <string[]>[],
        environment: core.getInput('environment'),
        payload: core.getInput('payload'),
    });
    if (deploymentResponse.status != 201) {
        core.setFailed(`createDeployment failed with status core ${deploymentResponse.status}`)
    }
}

if (process.env.GITHUB_ACTIONS) {
    run().catch((e) => core.setFailed(e.toString()));
}
