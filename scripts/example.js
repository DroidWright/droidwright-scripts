// ==DroidScript==
// @id              market-example
// @name            Welcome to Market
// @description     This is an example script hosted on the online market.
// @author          tas33n
// @version         1.0.0
// ==/DroidScript==

function droidRun(ctx) {
    ctx.device.showToast("Hello from the Online Market!");
    return { status: "ok" };
}