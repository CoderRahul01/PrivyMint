---
name: git-push-instructions
description: Provides formatted git add, commit, and push shell commands for the user to copy and execute on their own. Triggers whenever the user asks to push, commit, create a pull request, or request git push instructions.
---

# Git Push Instructions Skill

When this skill is triggered (or when the user asks to push changes, commit code, or requests git commands):

## Strict Agent Rules
1. **DO NOT** run `git commit`, `git push`, or `gh pr create` commands directly.
2. **DO** format clear, step-by-step git commands for the user to copy and run in their own terminal.
3. Include standard conventional commit message formatting (e.g. `feat:`, `fix:`, `docs:`, `chore:`).
4. Provide verification steps to confirm status after pushing.

## Standard Output Template for User

```bash
# 1. Check current git status
git status

# 2. Stage all modified and new files
git add .

# 3. Create a conventional commit
git commit -m "feat(preprod): deploy compact contract to Midnight Preprod devnet and update Lace wallet integration"

# 4. Push changes to remote repository
git push origin main
```
