export default class docUpdater {
  static update({ milestone, issues, milestoneNumber, issueNumber }, event, token) {
    if (event) return event.target.value;

    const milestoneTitle = milestone.title;
    const owner = process.env.REACT_APP_REPO_OWNER;
    const repo = process.env.REACT_APP_REPO_NAME;
    
    let result = '';

    if (milestoneTitle) {
      const number = milestoneNumber.toString();
      result = result.concat(
        `# [${milestoneTitle}](https://github.com/${owner}/${repo}/milestone/${number})\n\n`
        );
    }

    issues.forEach((issue, index) => {
      const number = (issueNumber + index).toString();
      if (issue.title !== '') {
        result = result.concat(
          `## [${issue.title}](https://github.com/${owner}/${repo}/issues/${number})\n\n`
          );

        if (issue.body !== '') {
          result = result.concat(`${issue.body}\n\n`)
        }
      }
    });

    return result;
  }

  static extractNumber(response) {
    if (response.data[0]) {
      return response.data[0].number + 1;
    }

    return null;
  }
}
