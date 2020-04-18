Hooks.once("init", () => {
	game.settings.register("pf2e-token-tooltip", "tooltipVisibility", {
		name: "PF2E Token Tooltip Visibility",
		hint: "This option determines on which tokens to display a tooltip when moused over for players. The tooltip is always displayed for the GM.",
		scope: "world",
		config: true,
		default: "owned",
		type: String,
		choices: {
			"gm": "GM Only",
			"owned": "Owned Tokens",
			"friendly": "Friendly Tokens",
			"all": "All Tokens"
		}
	});
});