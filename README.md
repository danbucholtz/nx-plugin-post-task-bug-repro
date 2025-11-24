# What is this?

This is a super simple nx repo showing a bug with the the `postTasksExecution` hook.

To see the issue, run `NX_DAEMON=false nx dev my-vite-lib`. When you kill the task after it starts (control-c), you'll observe some console.logs related to the `postTasksExecution` hooks.

Afterwards, run `nx dev my-vite-lib`. When you kill the task after it starts (control-c), you'll won't observe any console.logs. The behaviors are different. That's the bug.