import * as vscode from "vscode";
import { LinearClient } from "@linear/sdk";
import { GitExtension } from "./types.d/git";

/**
 * This extension registers the "Open in Linear command" upon activation.
 */

const LINEAR_AUTHENTICATION_PROVIDER_ID = "linear";
const LINEAR_AUTHENTICATION_SCOPES = ["read"];

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "linear-open-issue.openIssue",
    async () => {
      const session = await vscode.authentication.getSession(
        LINEAR_AUTHENTICATION_PROVIDER_ID,
        LINEAR_AUTHENTICATION_SCOPES,
        { createIfNone: true }
      );

      if (!session) {
        vscode.window.showErrorMessage(
          `We weren't able to log you into Linear when trying to open the issue.`
        );
        return;
      }

      const linearClient = new LinearClient({
        accessToken: session.accessToken,
      });

      // Use VS Code's built-in Git extension API to get the current branch name.
      const gitExtension =
        vscode.extensions.getExtension<GitExtension>("vscode.git")?.exports;
      const git = gitExtension?.getAPI(1);
      const branchName = git?.repositories[0]?.state.HEAD?.name;

      try {
        const request: {
          issueVcsBranchSearch: {
            identifier: string;
            team: {
              organization: {
                urlKey: string;
              };
            };
          } | null;
        } | null = await linearClient.client.request(`query {
            issueVcsBranchSearch(branchName: "${branchName}") {
              identifier
              team {
                organization {
                  urlKey
                }
              }
            }
          }`);

        if (request?.issueVcsBranchSearch?.identifier) {
          // Preference to open the issue in the desktop app or in the browser.
          const urlPrefix = vscode.workspace
            .getConfiguration()
            .get<boolean>("openInDesktopApp")
            ? "linear://"
            : "https://linear.app/";

          // Open the URL.
          vscode.env.openExternal(
            vscode.Uri.parse(
              urlPrefix +
                request?.issueVcsBranchSearch.team.organization.urlKey +
                "/issue/" +
                request?.issueVcsBranchSearch.identifier
            )
          );
        } else {
          vscode.window.showInformationMessage(
            `No Linear issue could be found matching the branch name ${branchName} in the authenticated workspace.`
          );
        }
      } catch (error) {
        vscode.window.showErrorMessage(
          `An error occurred while trying to fetch Linear issue information. Error: ${error}`
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
