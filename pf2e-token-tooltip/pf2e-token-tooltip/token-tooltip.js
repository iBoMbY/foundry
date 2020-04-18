// TOOLTIP ON HOVER
Hooks.on("hoverToken", (object, hovered) => {
	if (!object || !object.actor) return;
	if (event == undefined || keyboard.isDown("Alt")) return;

	// SETTINGS & DECLARATIONS
	let showTooltip = game.settings.get("pf2e-token-tooltip", "tooltipVisibility");
	let disposition = parseInt(object.data.disposition);

	// PARSE TOKEN/ACTOR INFO
	let info = null;
	
	try {
		info = {
			ac: isNaN(parseInt(object.actor.data.data.attributes.ac.value)) ? 10 : parseInt(object.actor.data.data.attributes.ac.value),
			hp: isNaN(parseInt(object.actor.data.data.attributes.hp.value)) ? 1 : parseInt(object.actor.data.data.attributes.hp.value),
			hpmax: isNaN(parseInt(object.actor.data.data.attributes.hp.max)) ? 1 : parseInt(object.actor.data.data.attributes.hp.max),
			temphp: isNaN(parseInt(object.actor.data.data.attributes.hp.temp)) ? 0 : parseInt(object.actor.data.data.attributes.hp.temp),
			speed: object.actor.data.data.attributes.speed.value,
			passives: {
				perception: 10 + parseInt(object.actor.data.data.attributes.perception.value)
			}
		};
		// CHECK IF TARGET HAS TEMP HP AND ADD TO TOOLTIP
		if (info.temphp !== 0) info.hp = info.hp + " (+" + info.temphp + ")";
	} catch (error) {
		return;
	}

	// TEMPORARY FIX FOR TOOLTIPS ON OVERWORLD MAP
	if (parseInt(info.ac) === 0) return;

	// DEFINE THE TEMPLATES
	let fullTemplate = $(`
		<div class="section">
			<div class="value"><i class="fas fa-shield-alt"></i>${info.ac}</div>
			<div class="value"><i class="fas fa-heart"></i>${info.hp} / ${info.hpmax}</div>
			<div class="value"><i class="far fa-eye"></i><span>${info.passives.perception}</div>
			<div class="value"><i class="fas fa-shoe-prints"></i><span>${info.speed}</div>
		</div>
    `);
	let partialTemplate = $(`
		<div class="section">
			<div class="value"><i class="fas fa-shield-alt"></i>${info.ac}</div>
			<div class="value"><i class="fas fa-heart"></i>${info.hp} / ${info.hpmax}</div>
		</div>
    `);

	// DETERMINE WHICH TOOLTIP TO USE
	let template = "";
	if (game.user.isGM) {
		template = fullTemplate;
	} else {
		if (showTooltip !== "gm") {
			if (object.actor.owner) {
				template = fullTemplate;
			} else {
				if (disposition === CONST.TOKEN_DISPOSITIONS.FRIENDLY) {
					if (showTooltip === "friendly" || showTooltip === "all") {
						template = fullTemplate;
					} else {
						hovered = false;
					}
				} else {
					if (showTooltip === "all") {
						template = partialTemplate;
					} else {
						hovered = false;
					}
				}
			}
		} else {
			hovered = false;
		}
	}

	// ADD OR REMOVE THE TOOLTIP
	if (hovered) {
		let dmtktooltip = $(`<div class="dmtk-tooltip ${object.data._id}"></div>`);
		dmtktooltip.css('left', (event.pageX + 10) + 'px');
		dmtktooltip.css('top', (event.pageY + 10) + 'px');
		dmtktooltip.html(template);
		$('body.game').append(dmtktooltip);
		setTimeout(function () {
			$("." + object.data._id).remove();
		}, 8000);
	} else {
		$("." + object.data._id).remove();
	}
});
