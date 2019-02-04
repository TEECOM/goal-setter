export default class docUpdater {
  static update(state, event, token) {
    const {
      currentRepo,
      milestone,
      issues,
      milestoneNumber,
      issueNumber,
    } = state;

    if (event) return event.target.value;

    const milestoneTitle = milestone.title;
    const owner = currentRepo.owner.login;
    const repo = currentRepo.name;
    
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

  static extractNumber(data) {
    if (data[0]) {
      return data[0].number + 1;
    }

    return null;
  }
}
