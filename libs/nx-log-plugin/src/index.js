const { writeFileSync } = require('fs');
const { join } = require('path');

exports.preTasksExecution = async (options, context) => {
  console.error('\n🚀 PRE-TASK EXECUTION FIRED!');
  console.error('Run ID:', context.id);
  console.error('Workspace Root:', context.workspaceRoot);
  
  if (context.taskGraph && context.taskGraph.tasks) {
    const taskCount = Object.keys(context.taskGraph.tasks).length;
    console.log('Number of tasks:', taskCount);
    
    const taskNames = Object.keys(context.taskGraph.tasks).map(taskId => {
      const task = context.taskGraph.tasks[taskId];
      return `${task.target.project}:${task.target.target}`;
    });
    console.log('Tasks:', taskNames.join(', '));
    
    // Write to file for inspection
    const filePath = join(context.workspaceRoot, `nx-log-${context.id}-pre.json`);
    writeFileSync(filePath, JSON.stringify({
      timestamp: new Date().toISOString(),
      phase: 'pre',
      runId: context.id,
      taskCount: taskCount,
      tasks: taskNames,
    }, null, 2));
    console.log('Pre-task data written to:', filePath);
  }
  console.log('');
};

exports.postTasksExecution = async (options, context) => {
  console.error('\n✅ POST-TASK EXECUTION FIRED!');
  console.error('Run ID:', context.id);
  console.error('Workspace Root:', context.workspaceRoot);
  
  if (context.taskResults) {
    const resultCount = Object.keys(context.taskResults).length;
    console.log('Number of task results:', resultCount);
    
    // Log each task result
    Object.entries(context.taskResults).forEach(([taskId, result]) => {
      const status = result.success ? '✓' : '✗';
      console.log(`  ${status} ${taskId}: ${result.success ? 'SUCCESS' : 'FAILED'}`);
      if (result.terminalOutput) {
        console.log(`    Terminal output length: ${result.terminalOutput.length} chars`);
      }
    });
    
    // Write to file for inspection
    const filePath = join(context.workspaceRoot, `nx-log-${context.id}-post.json`);
    writeFileSync(filePath, JSON.stringify({
      timestamp: new Date().toISOString(),
      phase: 'post',
      runId: context.id,
      taskResults: Object.entries(context.taskResults).map(([taskId, result]) => ({
        taskId,
        success: result.success,
        startTime: result.startTime,
        endTime: result.endTime,
        terminalOutputLength: result.terminalOutput?.length || 0,
      })),
    }, null, 2));
    console.log('Post-task data written to:', filePath);
  }
  console.log('');
};
