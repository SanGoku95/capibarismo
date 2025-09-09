# Repository Maintenance Guide

This guide is for repository maintainers to help manage the open source Presidential Punch Peru project effectively while maintaining political neutrality and quality standards.

## 🛡️ Repository Settings Recommendations

### Branch Protection Rules
Set up branch protection for the `main` branch:

1. Go to **Settings** → **Branches** → **Add rule**
2. **Branch name pattern**: `main`
3. **Protect matching branches**:
   - [x] Require a pull request before merging
   - [x] Require approvals: 1 (minimum)
   - [x] Dismiss stale PR approvals when new commits are pushed
   - [x] Require status checks to pass before merging
   - [x] Require branches to be up to date before merging
   - [x] Require linear history (optional, prevents merge commits)
   - [x] Include administrators

### Repository Settings
1. **General Settings**:
   - Enable Issues
   - Enable Projects (optional)
   - Enable Wiki (optional)
   - Enable Discussions (recommended for community engagement)

2. **Security Settings**:
   - Enable Dependabot alerts
   - Enable Dependabot security updates
   - Enable private vulnerability reporting

## 👥 Collaboration Management

### Contributor Roles
- **Owner/Admin**: Full repository control (you)
- **Maintainer**: Can manage issues, PRs, releases
- **Write Access**: For trusted regular contributors
- **Read Access**: Default for all contributors

### Pull Request Review Process

#### For Code Changes:
1. **Automated Checks**: Ensure CI passes (lint, build)
2. **Code Review**: Check for code quality, security, performance
3. **Testing**: Verify changes work as intended
4. **Documentation**: Ensure docs are updated if needed

#### For Data Changes:
1. **Source Verification**: All claims must have reliable sources
2. **Neutrality Check**: Ensure political neutrality is maintained
3. **Accuracy Review**: Verify factual accuracy
4. **Balance Assessment**: Ensure all candidates are treated equally

## 🗳️ Political Neutrality Guidelines

### Content Review Checklist
- [ ] Information is factual and verifiable
- [ ] Sources are credible and recent
- [ ] No opinion or bias present
- [ ] All candidates treated equally
- [ ] No advocacy for/against any candidate
- [ ] Language is neutral and professional

### Handling Political Discussions
1. **Redirect to facts**: Always steer discussions toward verifiable information
2. **No political debates**: Close discussions that become partisan
3. **Enforce neutrality**: Remove biased content immediately
4. **Document decisions**: Explain removals transparently

## 🔄 Issue & PR Management

### Issue Triage
1. **Label appropriately**: bug, feature, data, documentation, etc.
2. **Assess complexity**: good-first-issue, help-wanted
3. **Check for duplicates**: Link or close duplicates
4. **Request clarification**: Ask for more details if needed

### Common Response Templates

#### For Bug Reports:
```markdown
Thanks for the bug report! I can reproduce this issue. 

To help us fix this:
- [ ] Please specify your browser version
- [ ] Can you provide steps to reproduce?
- [ ] Any console errors visible?

Labels: bug, needs-info
```

#### For Data Issues:
```markdown
Thanks for bringing this to our attention. For data updates, we need:

- [ ] Reliable sources for the proposed changes
- [ ] Verification that information is current
- [ ] Confirmation that the source is credible

Please provide these and we'll review the update.

Labels: data, needs-verification
```

#### For Feature Requests:
```markdown
Interesting idea! Before we proceed:

- [ ] Does this align with our political neutrality policy?
- [ ] How would this benefit our users?
- [ ] Do you have implementation suggestions?

Let's discuss the approach before implementation.

Labels: enhancement, discussion
```

## 🚀 Release Management

### Version Numbering
Use [Semantic Versioning](https://semver.org/):
- **PATCH** (0.1.1): Bug fixes, data updates
- **MINOR** (0.2.0): New features, UI improvements
- **MAJOR** (1.0.0): Breaking changes, major overhauls

### Release Checklist
- [ ] All tests pass
- [ ] Build succeeds
- [ ] Security audit clean
- [ ] Documentation updated
- [ ] CHANGELOG updated
- [ ] Version number bumped
- [ ] Tagged release created
- [ ] Release notes written

## 📊 Data Management

### Data Update Process
1. **Review Sources**: Verify all sources are credible
2. **Check Neutrality**: Ensure balanced treatment
3. **Verify Accuracy**: Cross-reference multiple sources
4. **Test Impact**: Check how changes affect UI/UX
5. **Document Changes**: Update any relevant documentation

### Source Quality Standards
- **Government websites**: Official candidate information
- **Reputable news sources**: El Comercio, La República, etc.
- **Academic institutions**: Universities, research centers
- **NGO reports**: Transparency organizations
- **Avoid**: Social media posts, unverified claims, opinion pieces

## 🔒 Security Considerations

### Regular Security Tasks
- **Weekly**: Review dependabot alerts
- **Monthly**: Run comprehensive security audit
- **Per Release**: Security review of new code
- **As Needed**: Address reported vulnerabilities

### Sensitive Information
Never allow:
- Personal/private candidate information
- Unverified claims or rumors
- API keys or credentials
- Personal contact information

## 📈 Community Growth

### Encouraging Contributions
- **Welcome newcomers**: Be friendly and helpful
- **Good first issues**: Label easy starter tasks
- **Recognition**: Thank contributors in releases
- **Documentation**: Keep contribution guides current

### Handling Conflicts
1. **Stay neutral**: Don't take political sides
2. **Focus on facts**: Redirect to verifiable information
3. **Enforce policies**: Apply code of conduct consistently
4. **Document decisions**: Be transparent about actions taken

## 📞 Communication Channels

### Internal (Maintainers)
- GitHub Issues for public discussions
- Private messages for sensitive matters
- Repository Discussions for community engagement

### External (Community)
- GitHub Issues for bug reports and features
- Discussions for general questions
- Pull requests for contributions

## 🆘 Emergency Procedures

### Content Issues
1. **Immediate**: Remove harmful/false content
2. **Communicate**: Explain removal transparently
3. **Document**: Record decision rationale
4. **Follow-up**: Address underlying process gaps

### Security Issues
1. **Assess severity**: Critical vs. non-critical
2. **Coordinate response**: Notify relevant stakeholders
3. **Fix promptly**: Patch critical issues immediately
4. **Communicate**: Inform users appropriately

## 📚 Resources

- [GitHub Docs - Managing a Repository](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features)
- [Open Source Guides](https://opensource.guide/)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)

---

Remember: The goal is to maintain a high-quality, politically neutral resource that serves democracy in Peru. Every decision should be made with transparency, accuracy, and fairness in mind.