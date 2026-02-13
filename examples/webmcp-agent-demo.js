/**
 * WebMCP Agent Demo: 5-4-3-2-1 Grounding Exercise
 *
 * Chrome Canary (146+) で /grounding を開き、
 * DevTools Console にこのスクリプトを貼り付けて実行。
 *
 * 前提: chrome://flags → #web-mcp を Enabled にしておくこと
 */
(async () => {
  if (!navigator.modelContext) {
    console.error('WebMCP not available. Enable chrome://flags/#web-mcp');
    return;
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // --- Tool interception ---
  let currentTools = [];
  let onToolsUpdated = null;

  const origProvideContext =
    navigator.modelContext.provideContext.bind(navigator.modelContext);

  navigator.modelContext.provideContext = (ctx) => {
    currentTools = ctx.tools;
    origProvideContext(ctx);
    if (onToolsUpdated) {
      onToolsUpdated();
      onToolsUpdated = null;
    }
  };

  const waitForToolUpdate = () =>
    new Promise((r) => {
      onToolsUpdated = r;
    });

  const callTool = async (name, params = {}) => {
    const tool = currentTools.find((t) => t.name === name);
    if (!tool) {
      console.error(
        `  Tool "${name}" not found. Available: ${currentTools.map((t) => t.name).join(', ')}`,
      );
      return null;
    }
    const hasParams = Object.keys(params).length > 0;
    console.log(`🔧 ${name}${hasParams ? ' ' + JSON.stringify(params) : ''}`);
    const result = await tool.execute(params);
    const text = result.content[0].text;
    console.log(`   → ${text}`);
    return text;
  };

  // --- Demo start ---
  console.log('%c🤖 AI Agent Demo: 5-4-3-2-1 Grounding', 'font-size:16px;font-weight:bold');
  console.log('━'.repeat(50));

  // Capture initial tools by toggling to history and back
  let p = waitForToolUpdate();
  document.querySelector('[data-testid="grounding-history-btn"]').click();
  await p;

  p = waitForToolUpdate();
  document.querySelector('[data-testid="grounding-back-btn"]').click();
  await p;

  console.log('\n%c📍 start', 'color:#8d6e63;font-weight:bold');
  console.log(`   tools: [${currentTools.map((t) => t.name).join(', ')}]`);
  await sleep(600);

  // --- Start session ---
  console.log('\n%c🧠 Agent: "Let\'s begin the grounding exercise."', 'color:#666');
  p = waitForToolUpdate();
  await callTool('start-grounding-session');
  await p;

  console.log('\n%c📍 step', 'color:#8d6e63;font-weight:bold');
  await sleep(400);
  await callTool('get-grounding-status');

  // --- Submit all 5 steps ---
  const sampleData = [
    {
      sense: 'sight',
      responses: ['desk lamp', 'window', 'bookshelf', 'coffee mug', 'keyboard'],
    },
    { sense: 'touch', responses: ['warm cup', 'soft blanket', 'cool desk', 'smooth phone'] },
    { sense: 'sound', responses: ['bird song', 'fan humming', 'distant traffic'] },
    { sense: 'smell', responses: ['fresh coffee', 'morning air'] },
    { sense: 'taste', responses: ['green tea'] },
  ];

  for (let i = 0; i < sampleData.length; i++) {
    const { sense, responses } = sampleData[i];
    const isLast = i === sampleData.length - 1;

    await sleep(800);
    console.log(
      `\n%c🧠 Agent: "For ${sense}, I notice: ${responses.join(', ')}"`,
      'color:#666',
    );

    if (isLast) p = waitForToolUpdate();
    await callTool('submit-grounding-step', { responses });
    if (isLast) await p;
  }

  // --- Complete ---
  console.log('\n%c📍 complete', 'color:#8d6e63;font-weight:bold');
  console.log(`   tools: [${currentTools.map((t) => t.name).join(', ')}]`);
  await sleep(600);

  console.log('\n%c🧠 Agent: "Great session! Let me check the history."', 'color:#666');
  await callTool('get-grounding-history');

  await sleep(800);
  p = waitForToolUpdate();
  await callTool('finish-grounding');
  await p;

  // --- Done ---
  console.log('\n%c📍 start', 'color:#8d6e63;font-weight:bold');
  console.log('━'.repeat(50));
  console.log('%c✅ Demo complete!', 'color:green;font-weight:bold');
  console.log('   Session saved to IndexedDB. Check the history screen.');

  // Restore original
  navigator.modelContext.provideContext = origProvideContext;
})();
