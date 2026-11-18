import os
import sys

from github import Auth, Github, GithubException

token = os.environ["GITHUB_TOKEN"]
repo_name = os.environ["REPOSITORY"]
issue_number = os.environ["ISSUE_NUMBER"]

auth = Auth.Token(token)
gh = Github(auth=auth)
repo = gh.get_repo(repo_name)

try:
    issue_number = int(issue_number)
except:
    print("Issue number is not numeric!")
    sys.exit(1)


issue = repo.get_issue(issue_number)
author = "Tadomika-Ari"

if author:
    try:
        issue.add_to_assignees(author)

        assigned_issue = repo.get_issue(issue_number)
        assigned = assigned_issue.assignees
        assigned_logins = {assignee.login for assignee in assigned}
        if author not in assigned_logins:
            print(f"GitHub did not add {author} as an assignee; current assignees: {sorted(assigned_logins)}")
            issue.create_comment(
                f"CC @{author}. GitHub could not assign this issue automatically. "
                "A maintainer can add the assignee manually."
            )
            sys.exit(1)

        issue.create_comment(f"CC @{author}. You have been automatically assigned to this issue. You can close this issue if necessary using the command `/close-issue`")
    except GithubException as exc:
        print(f"Could not assign {author}: status={exc.status}, message={exc.data}")
        issue.create_comment(
            f"CC @{author}. GitHub could not assign this issue automatically. "
            "A maintainer can add the assignee manually."
        )
        sys.exit(1)
else:
    print("Could not get the author.")
    sys.exit(1)
