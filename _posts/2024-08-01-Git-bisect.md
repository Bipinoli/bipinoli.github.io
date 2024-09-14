---
layout: post
title: Git bisect
---
[Git bisect](https://git-scm.com/docs/git-bisect) is a tool that does binary search in the git history between commits to locate the actual commit where the change of interest happen. This "change of interest" is usually a bug, so `git bisect bad` command is used to indicate observation of it.

### How to use?
Basically we do manual binary search.
- do `git bisect start` to start git bisect
- do `git bisect bad` to mark current commit as bad
- do `git bisect good <<commit_hash>>` to mark good commit
- do `git bisect` to bisect to a mid commit

Before marking current commit as good or bad we check the "change of interest".
This could be manual inspection, test run, performance logs, anything.

## When to use?
Anytime you want to locate the actual commit that caused the change. The affect of change must be reproducible.
- Where was the bug introduced?
- What exactly improved this performance?
- What change cause the test to start failing?
- etc. etc.


### Related
[Russ cox's blog on "Hash-Based Bisect Debugging in Compilers and Runtimes"](https://research.swtch.com/bisect)
