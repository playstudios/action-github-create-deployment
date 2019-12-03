"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        let owner = core.getInput('owner');
        let repo = core.getInput('repo');
        let ref = core.getInput('ref');
        let environment = core.getInput('environment');
        core.info(`Deploying ${owner}/${repo}@${ref} to ${environment}`);
        let octokit = new github.GitHub(process.env.GITHUB_TOKEN || '');
        let deploymentResponse = yield octokit.repos.createDeployment({
            owner,
            repo,
            ref,
            environment,
            auto_merge: false,
            required_contexts: [],
            payload: core.getInput('payload'),
        });
        if (deploymentResponse.status != 201) {
            core.setFailed(`createDeployment failed with status core ${deploymentResponse.status}`);
        }
    });
}
if (process.env.GITHUB_ACTIONS) {
    run().catch((e) => core.setFailed(e.toString()));
}
