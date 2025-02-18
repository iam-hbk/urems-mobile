# GitHub Workflow Guide

## Issue Management

### Creating Issues

1. **Issue Title**
   - Must be clear and descriptive
   - Should briefly summarize the problem
   - Example: "Login form fails validation on Safari browsers"

2. **Issue Description Requirements**
   - **Reproduction Steps**
     - Detailed step-by-step guide to reproduce the issue
     - Environment details (OS, browser version, etc.)
     - Any relevant configuration settings
   
   - **Screenshots/Videos**
     - Include visual evidence where applicable
     - Annotate screenshots to highlight specific areas
     - For UI issues, include before/after screenshots
   
   - **Expected vs Actual Behavior**
     - Clearly state what should happen
     - Describe what actually happens
   
   - **Fix Proposal (if available)**
     - Suggested approach to resolve the issue
     - Potential impact areas
   
   - **Success Criteria**
     - Specific, measurable outcomes that indicate the issue is resolved
     - Test cases that should pass

### Example Issue Template
```markdown
## Description
[Clear description of the issue]

## Steps to Reproduce
1. [First Step]
2. [Second Step]
3. [Additional Steps...]

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Screenshots
[If applicable]

## Environment
- OS: [e.g., iOS, Windows]
- Browser: [e.g., Chrome, Safari]
- Version: [e.g., 22]

## Proposed Solution
[If available]

## Success Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
```

## Branch Management

### Branch Naming Convention
- Create branches from issues using the format:
  - For features: `feature/issue-number-brief-description`
  - For bugs: `fix/issue-number-brief-description`
  - Example: `fix/123-safari-login-validation`

### Branch Workflow
1. Create branch from latest `staging`
2. Make changes locally
3. Push to remote branch
4. Create PR to `staging`
5. After approval and testing, merge to `main`

## Commit Guidelines

### Commit Message Format
```
<type>: <issue-number> <description>

[optional body]

[optional footer]
```

### Commit Types
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Formatting, missing semicolons, etc.
- `refactor:` - Code restructuring
- `chore:` - Maintenance tasks

### Example Commit Messages
```
feat: #123 Add password strength indicator
fix: #456 Resolve Safari form validation
docs: #789 Update API documentation
```

## Pull Request Process

### Creating Pull Requests
1. Create PR from your feature branch to `staging`
2. Fill out PR template
3. Request reviews from team members
4. Address feedback and make requested changes
5. Update branch with latest staging if needed
6. Merge once approved and tests pass

### PR Template
```markdown
## Related Issue
Fixes #[issue-number]

## Changes Made
- [Change 1]
- [Change 2]

## Testing Done
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing

## Screenshots
[If applicable]

## Reviewer Checklist
- [ ] Code follows style guidelines
- [ ] Tests are passing
- [ ] Documentation is updated
```
