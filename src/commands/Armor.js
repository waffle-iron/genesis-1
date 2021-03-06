'use strict';

const Command = require('../Command.js');

function damageReduction(currentArmor) {
  const damageRes = (parseFloat(currentArmor) / (parseFloat(currentArmor) + 300) * 100).toFixed(2);
  return `${damageRes}% damage reduction`;
}

function armorStrip(armor) {
  const armorStripValue = 8 * Math.log10(parseInt(armor, 10)).toFixed(2);
  return `You will need ${Math.ceil(armorStripValue)} corrosive procs to strip your enemy of armor.`;
}


/**
 * Describes the Armor command
 */
class Armor extends Command {
  constructor(bot) {
    super(bot);
    this.commandId = 'genesis.shields';
    // eslint-disable-next-line no-useless-escape
    this.commandRegex = new RegExp(`^${bot.escapedPrefix}armor(?:\s+([\d+\.?\d*\s]+))?`, 'i');
    this.commandHelp = `${bot.prefix}armor           | Display instructions for calculating armor${bot.md.lineEnd}` +
                       `${bot.prefix}armor           | Display current damage resistance and amount of corrosive procs required to strip it. Params: <current armor>${bot.md.lineEnd}` +
                       `${bot.prefix}armor           | Display the current armor, damage resistance, and necessary corrosive procs to strip armor. Params: <base armor> <base level> <current level>`;
    this.md = bot.md;
  }

  get id() {
    return this.commandId;
  }

  get command() {
    return this.commandRegex;
  }

  get help() {
    return this.commandHelp;
  }

  run(message) {
    const pattern3Params = new RegExp(/(\d+\.?\d*)(?:\s+(\d+\.?\d*)\s+(\d+\.?\d*))?$/);
    const params3 = message.content.match(pattern3Params);
    let armorString;
    if (params3 && params3.length > 3) {
      const armor = params3[1];
      const baseLevel = params3[2];
      const currentLevel = params3[3];
      if (typeof baseLevel === 'undefined') {
        this.bot.debug('Entered 1-param armor');
        armorString = `${this.md.codeMulti}${damageReduction(armor)}${this.md.lineEnd} ${armorStrip(armor)} ${this.md.blockEnd}`;
      } else {
        this.bot.debug('Entered 3-param armor');
        armorString = this.armorFull(armor, baseLevel, currentLevel);
      }
    } else {
      this.bot.debug('Entered 0-param armor');
      const armorInstruct3 = 'armor (Base Armor) (Base Level) (Current Level) calculate armor and stats.';
      const armorInstruct1 = 'armor (Current Armor) Calculate damage resistance.';
      armorString = `${this.md.codeMulti}Possible uses include:${this.md.lineEnd}${armorInstruct3}${this.md.lineEnd}${armorInstruct1}${this.md.blockEnd}`;
    }
    message.reply(armorString);
  }

  armorFull(baseArmor, baseLevel, currentLevel) {
    const armor = (parseFloat(baseArmor) *
                   (1 + (Math.pow((parseFloat(currentLevel) - parseFloat(baseLevel)), 1.75)
                         / 200))).toFixed(2);
    const armorString = `At level ${parseFloat(currentLevel).toFixed(0)} your enemy would have ${armor} Armor ${this.md.lineEnd} ${damageReduction(armor)}`;
    return `${this.md.codeMulti}${armorString} ${this.md.linEnd} ${armorStrip(armor)}${this.md.blockEnd}`;
  }
}

module.exports = Armor;
