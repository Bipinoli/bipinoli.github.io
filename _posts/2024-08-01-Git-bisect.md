---
layout: post
title: Git bisect
---
[Git bisect](https://git-scm.com/docs/git-bisect) is a tool that does binary search in the git history between commits to locate the actual commit where the change of interest happen.

### How to use?
- git bisect start -> start git bisect
- git bisect bad -> mark current commit as bad
- git bisect good <<commit_hash>> -> mark good commit
- git bisect -> bisect to a mid commit
- check if the change of interest happened
- if yes -> git bisect bad
- if no -> git bisect good

## When to use?
Anytime you want to locate the actual commit that caused the change. The affect of change must be reproducible.
- Where was the bug introduced?
- What exactly improved this performance?
- What change cause the test to start failing?
- etc. etc.


### Related
[Russ cox's blog on "Hash-Based Bisect Debugging in Compilers and Runtimes"](https://research.swtch.com/bisect)
