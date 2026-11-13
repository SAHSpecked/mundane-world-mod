const MODULE_ID = "mundane-world-mod";

const ACTORS = [
  // Testing
  {
    name: "Test",
    id: "aO3bWpI9kFf7WtO7",
    hitDiceRecoveryClasses: ["Warlock"],
    srExhaustionRecovery: true,
  },

  // A "Hands On" Adventure
  {
    name: "Berry",
    id: "Lq7FVtvMN5Wq4ITZ",
    hitDiceRecoveryClasses: ["Druid"],
    srExhaustionRecovery: false,
  },
  {
    name: "Delta",
    id: "",
    hitDiceRecoveryClasses: ["Wizard"],
    srExhaustionRecovery: false,
  },
  {
    name: "Felix",
    id: "NUN20Mh4p1QxKcws",
    hitDiceRecoveryClasses: ["Artificer"],
    srExhaustionRecovery: false,
  },
  {
    name: "Forcus",
    id: "dJLuKdNJ8mGkxSeh",
    hitDiceRecoveryClasses: ["Warlock"],
    srExhaustionRecovery: false,
  },
  {
    name: "Gale",
    id: "HbKS0mbIr1sCTaUy",
    hitDiceRecoveryClasses: ["Rogue"],
    srExhaustionRecovery: false,
  },
  {
    name: "Misha",
    id: "1haYgIQBNwRZ1IlQ",
    hitDiceRecoveryClasses: ["Warlock"],
    srExhaustionRecovery: false,
  },
  {
    name: "Ren",
    id: "",
    hitDiceRecoveryClasses: ["Warlord", "Ranger"],
    srExhaustionRecovery: true,
  },
  {
    name: "Tom",
    id: "",
    hitDiceRecoveryClasses: ["Vessel"],
    srExhaustionRecovery: false,
  },
  {
    name: "Trinity",
    id: "",
    hitDiceRecoveryClasses: ["Paladin"],
    srExhaustionRecovery: false,
  },
  {
    name: "Valdimira",
    id: "18XwFY4oOoApeiu8",
    hitDiceRecoveryClasses: ["Bard", "Rogue"],
    srExhaustionRecovery: false,
  },

  // The Fellowship of the Arcane
  {
    name: "Doc Squibly",
    id: "TQdwxIuICLlIzKhC",
    hitDiceRecoveryClasses: ["Bard"],
    srExhaustionRecovery: false,
  },
  {
    name: "Kanzou",
    id: "zg3nljrQluUQbS5m",
    hitDiceRecoveryClasses: ["Barbarian", "Rogue"],
    srExhaustionRecovery: false,
  },
  {
    name: "Styx",
    id: "ZUeXvvGAeVoqaA6e",
    hitDiceRecoveryClasses: ["Cleric"],
    srExhaustionRecovery: false,
  },
  {
    name: "West",
    id: "fMuwwbHhWz78bacH",
    hitDiceRecoveryClasses: ["Artificer"],
    srExhaustionRecovery: false,
  },
  {
    name: "Whistle",
    id: "LGAA3DcTvsZuKx8H",
    hitDiceRecoveryClasses: ["Monk"],
    srExhaustionRecovery: false,
  },
];

// Patch hit dice recovery and register settings for Magic Tables
// First argument for registering settings is the module's "id" or just "core" for unmanaged settings
Hooks.on("init", () => {
  console.log("------ CHANGING MAX LEVEL TO 120 -------");
  CONFIG.DND5E.maxLevel = 120;

  console.log("------ PATCHING SHORT REST EXHAUSTION RECOVERY -------");
  patch__rest();

  console.log("------ PATCHING HIT DICE RECOVERY -------");
  patch__getRestHitDiceRecovery();

  console.log("------ PATCHING RESOURCE, SPELL, ITEM RECOVERY -------");
  patch__getRestResourceRecovery();
  patch__getRestSpellRecovery();
  patch__getRestItemUsesRecovery();

  console.log("------ REGISTERING MODULE SETTINGS -------");

  // AHOA Settings
  game.settings.register(MODULE_ID, "enableMagicTablesAHOA", {
    name: "Enable Magic Tables (AHOA)",
    hint: "Any actor not on the exception list, who casts a spell, will automatically roll the Magic Tables",
    scope: "world", // "world" = sync to db, "client" = local storage
    config: true,
    type: Boolean,
    default: false,
    onChange: (value) => {
      // value is the new value of the setting
      console.log("Enable Magic Tables (AHOA): " + value);
    },
  });

  game.settings.register(MODULE_ID, "magicTablesIdsAHOA", {
    name: "Magic Tables Ids (AHOA)",
    hint: "Space-separated table ids of the current Magic Tables",
    scope: "world", // "world" = sync to db, "client" = local storage
    config: true,
    type: String,
    default: "",
    onChange: (value) => {
      // value is the new value of the setting
      console.log("Magic Tables Ids (AHOA): " + value);
    },
  });

  game.settings.register(MODULE_ID, "magicTablesExceptionsAHOA", {
    name: "Magic Tables Exceptions (AHOA)",
    hint: "Space-separated actor ids who are immune to the current Magic Tables",
    scope: "world", // "world" = sync to db, "client" = local storage
    config: true,
    type: String,
    default: "",
    onChange: (value) => {
      // value is the new value of the setting
      console.log("Magic Tables Exceptions (AHOA): " + value);
    },
  });

  // TFA Settings
  game.settings.register(MODULE_ID, "enableMagicTablesTFA", {
    name: "Enable Magic Tables (TFA)",
    hint: "Any actor not on the exception list, who casts a spell, will automatically roll the Magic Tables",
    scope: "world", // "world" = sync to db, "client" = local storage
    config: true,
    type: Boolean,
    default: false,
    onChange: (value) => {
      // value is the new value of the setting
      console.log("Enable Magic Tables (TFA): " + value);
    },
  });

  game.settings.register(MODULE_ID, "magicTablesIdsTFA", {
    name: "Magic Tables Ids (TFA)",
    hint: "Space-separated table ids of the current Magic Tables",
    scope: "world", // "world" = sync to db, "client" = local storage
    config: true,
    type: String,
    default: "",
    onChange: (value) => {
      // value is the new value of the setting
      console.log("Magic Tables Ids (TFA): " + value);
    },
  });

  game.settings.register(MODULE_ID, "magicTablesExceptionsTFA", {
    name: "Magic Tables Exceptions (TFA)",
    hint: "Space-separated actor ids who are immune to the current Magic Tables",
    scope: "world", // "world" = sync to db, "client" = local storage
    config: true,
    type: String,
    default: "",
    onChange: (value) => {
      // value is the new value of the setting
      console.log("Magic Tables Exceptions (TFA): " + value);
    },
  });

  // Other Settings
  game.settings.register(MODULE_ID, "shorties", {
    name: "Shorties",
    hint: "Space-separated actor ids who uniquely recover long rest resources on short rests instead",
    scope: "world", // "world" = sync to db, "client" = local storage
    config: true,
    type: String,
    default: "",
    onChange: (value) => {
      // value is the new value of the setting
      console.log("Shorties: " + value);
    },
  });
});

// Expands the list of dnd5e hit die types
Hooks.on("setup", () => {
  console.log("------ EXPANDING HIT DIE TYPES -------");
  CONFIG.DND5E.hitDieTypes = ["d2", "d4", "d6", "d8", "d10", "d12", "d20"];
});

// Magic tables automation
Hooks.on("dnd5e.useItem", async (item, config, options) => {
  // Roll current magic tables if enabled, on spellcast, and if actor is not an exception
  if (game.settings.get(MODULE_ID, "enableMagicTablesAHOA")) {
    if (item.type == "spell") {
      const exceptions = game.settings.get(MODULE_ID, "magicTablesExceptionsAHOA").split(/\s+/);
      if (!exceptions.includes(item.actor.id)) {
        const tables = game.settings.get(MODULE_ID, "magicTablesIdsAHOA").split(/\s+/);
        for (const tableId of tables) {
          await game.tables.get(tableId).draw();
        }
      }
    }
  }

  if (game.settings.get(MODULE_ID, "enableMagicTablesTFA")) {
    if (item.type == "spell") {
      const exceptions = game.settings.get(MODULE_ID, "magicTablesExceptionsTFA").split(/\s+/);
      if (!exceptions.includes(item.actor.id)) {
        const tables = game.settings.get(MODULE_ID, "magicTablesIdsTFA").split(/\s+/);
        for (const tableId of tables) {
          await game.tables.get(tableId).draw();
        }
      }
    }
  }
});

async function patch__rest() {
  libWrapper.register(
    MODULE_ID, // the package's "id" or your world's manifest "id"
    "CONFIG.Actor.documentClass.prototype._rest",
    async function (config, result = {}) {
      const shorties = game.settings.get(MODULE_ID, "shorties").split(/\s+/);
      const shorty = shorties.includes(this.id);
      if (shorty) console.log(`------ MODIFYING SHORTY RECOVERY (${this.name}) -------`);

      if (foundry.utils.getType(this.system.rest) === "function" && (await this.system.rest(config, result)) === false)
        return;

      result = foundry.utils.mergeObject(
        {
          type: config.type,
          deleteItems: [],
          deltas: {
            hitPoints: 0,
            hitDice: 0,
          },
          newDay: config.newDay === true,
          request: config.request,
          rolls: [],
          updateData: {},
          updateItems: [],
        },
        result,
      );
      result.clone ??= this.clone();
      if ("dhp" in result) result.deltas.hitPoints = result.dhp;
      if ("dhd" in result) result.deltas.hitDice = result.dhd;

      this._getRestHitDiceRecovery(config, result);
      this._getRestHitPointRecovery(config, result);
      this._getRestResourceRecovery(config, result);
      this._getRestSpellRecovery(config, result);
      await this._getRestItemUsesRecovery(config, result);

      result.dhp = result.deltas.hitPoints;
      result.dhd = result.deltas.hitDice;
      result.longRest = result.type === "long";

      // Patch for short rest exhaustion recovery
      if (result.type === "short") {
        const findActorSr = ACTORS.find((obj) => obj.id == this.id && obj.srExhaustionRecovery == true);
        if (findActorSr != undefined) {
          console.log(`------ SHORT REST EXHAUSTION (${this.name}) -------`);
          config.exhaustionDelta = -1;
        }
      }

      if (
        config.exhaustionDelta &&
        !result.clone.hasConditionEffect("malnourished") &&
        !result.clone.hasConditionEffect("dehydrated")
      ) {
        const path = "system.attributes.exhaustion";
        const value = foundry.utils.getProperty(result.clone, path) ?? 0;
        foundry.utils.mergeObject(result.updateData, { [path]: Math.max(0, value + config.exhaustionDelta) });
      }

      /**
       * A hook event that fires after rest result is calculated, but before any updates are performed.
       * @function dnd5e.preRestCompleted
       * @memberof hookEvents
       * @param {Actor5e} actor             The actor that is being rested.
       * @param {RestResult} result         Details on the rest to be completed.
       * @param {RestConfiguration} config  Configuration data for the rest occurring.
       * @returns {boolean}                 Explicitly return `false` to prevent the rest updates from being performed.
       */
      if (Hooks.call("dnd5e.preRestCompleted", this, result, config) === false) return result;

      // Expire active effects
      const expiryEvents = CONFIG.DND5E.restTypes[config.type ?? "long"]?.expiryEvents ?? [];
      let operations = [];
      if (expiryEvents.length) {
        const expired = new Map();
        const expireEffect = (effect) => {
          if (expiryEvents.includes(effect.duration.expiry)) expired.getOrInsert(effect.parent, []).push(effect.id);
        };
        for (const effect of this.effects) {
          if (!effect.getFlag("dnd5e", "dependentOn")) expireEffect(effect);
        }
        for (const item of this.items) {
          for (const effect of item.effects) {
            if (effect.getFlag("dnd5e", "dependentOn")) continue;
            if (effect.isAppliedEnchantment) expireEffect(effect);
          }
        }
        operations = expired
          .entries()
          .map(([parent, ids]) => ({ action: "delete", documentName: "ActiveEffect", ids, parent }))
          .toArray();
      }

      // Perform updates
      await this.performBulkUpdate(
        { actor: result.updateData, delete: result.deleteItems, item: result.updateItems, operations },
        { isRest: true },
      );

      // Advance the game clock
      if (config.advanceTime && config.duration > 0 && game.user.isGM) await game.time.advance(60 * config.duration);

      // Display a Chat Message summarizing the rest effects
      if (config.chat) result.message = await this._displayRestResultMessage(config, result);

      /**
       * A hook event that fires when the rest process is completed for an actor.
       * @function dnd5e.restCompleted
       * @memberof hookEvents
       * @param {Actor5e} actor             The actor that just completed resting.
       * @param {RestResult} result         Details on the rest completed.
       * @param {RestConfiguration} config  Configuration data for that occurred.
       */
      Hooks.callAll("dnd5e.restCompleted", this, result, config);

      if (
        config.advanceBastionTurn &&
        game.user.isGM &&
        game.settings.get("dnd5e", "bastionConfiguration").enabled &&
        this.itemTypes.facility.length
      )
        await dnd5e.bastion.advanceAllFacilities(this);

      // Return data summarizing the rest effects
      return result;
    },
    "OVERRIDE",
  );
}

async function patch__getRestHitDiceRecovery() {
  libWrapper.register(
    MODULE_ID, // the package's "id" or your world's manifest "id"
    "CONFIG.Actor.documentClass.prototype._getRestHitDiceRecovery",
    async function ({ maxHitDice, fraction, ...config } = {}, result = {}) {
      const restConfig = CONFIG.DND5E.restTypes[config.type];
      if (!this.system.attributes.hd || !restConfig?.recoverHitDice) return;
      fraction ??= dnd5e.settings.rulesVersion === "modern" ? 1 : 0.5;

      // Handle simpler HD recovery for NPCs
      if (this.system.isNPC) {
        const hd = this.system.attributes.hd;
        const recovered = Math.min(Math.max(1, Math.floor(hd.max * fraction)), hd.spent, maxHitDice ?? Infinity);
        foundry.utils.mergeObject(result, {
          deltas: {
            hitDice: (result.deltas?.hitDice ?? 0) + recovered,
          },
          updateData: {
            "system.attributes.hd.spent": hd.spent - recovered,
          },
        });
        return;
      }

      // this.system.attributes.hd.createHitDiceUpdates({ maxHitDice, fraction, ...config }, result);
      customCreateHitDiceUpdates.call(this.system.attributes.hd, this, { maxHitDice, fraction, ...config }, result);
    },
    "OVERRIDE",
  );
}

async function customCreateHitDiceUpdates(
  actor,
  { maxHitDice, fraction = 0.5, largest = true, ...config } = {},
  result = {},
) {
  if (!Number.isInteger(maxHitDice)) maxHitDice = Math.max(Math.floor(this.max * fraction), 1);

  // Grab classes as values
  let classes = Array.from(this.classes);

  // Modify available classes for the special actors and set their maxHitDice differently
  const findActor = ACTORS.find((obj) => obj.id == actor.id);
  if (findActor != undefined) {
    console.log(`------ MODIFYING HIT DIE RECOVERY (${actor.name}) -------`);

    // Filter out to only recovery classes
    classes = classes.filter((cla) => findActor.hitDiceRecoveryClasses.includes(cla.name));
  }

  classes.sort((lhs, rhs) => {
    const sort = lhs.system.hd.denomination.localeCompare(rhs.system.hd.denomination, "en", { numeric: true });
    return largest ? sort * -1 : sort;
  });

  const updateItems = [];
  let recovered = 0;
  for (const item of classes) {
    const used = item.system.hd.spent;
    if (recovered < maxHitDice && used > 0) {
      const delta = Math.min(used, maxHitDice - recovered);
      recovered += delta;
      updateItems.push({ _id: item.id, "system.hd.spent": used - delta });
    }
  }
  foundry.utils.mergeObject(result, {
    deltas: {
      hitDice: (result?.deltas?.hitDice ?? 0) + recovered,
    },
    updateItems,
  });
}

async function patch__getRestResourceRecovery() {
  libWrapper.register(
    MODULE_ID, // the package's "id" or your world's manifest "id"
    "CONFIG.Actor.documentClass.prototype._getRestResourceRecovery",
    async function ({ recoverShortRestResources, recoverLongRestResources, ...config } = {}, result = {}) {
      recoverShortRestResources ??= config.type === "short";
      recoverLongRestResources ??= config.type === "long";

      // Shorties: Class abilities, item charges, and spell slots do NOT on recover on a long rest, but on a short rest instead.
      // Check for shorties (those who get back long rest resources on short rests instead)
      const shorties = game.settings.get(MODULE_ID, "shorties").split(/\s+/);
      const shorty = shorties.includes(this.id);
      const longRest = result.type === "long";
      if (shorty && longRest) recoverLongRestResources = false;
      if (shorty && !longRest) recoverLongRestResources = true;

      for (let [k, r] of Object.entries(this.system.resources ?? {})) {
        if (Number.isNumeric(r.max) && ((recoverShortRestResources && r.sr) || (recoverLongRestResources && r.lr))) {
          result.updateData[`system.resources.${k}.value`] = Number(r.max);
        }
      }
    },
    "OVERRIDE",
  );
}

async function patch__getRestSpellRecovery() {
  libWrapper.register(
    MODULE_ID, // the package's "id" or your world's manifest "id"
    "CONFIG.Actor.documentClass.prototype._getRestSpellRecovery",
    async function ({ recoverShort, recoverLong, ...config } = {}, result = {}) {
      const restConfig = CONFIG.DND5E.restTypes[config.type];

      // Shorties: Class abilities, item charges, and spell slots do NOT on recover on a long rest, but on a short rest instead.
      // Check for shorties (those who get back long rest resources on short rests instead)
      const shorties = game.settings.get(MODULE_ID, "shorties").split(/\s+/);
      const shorty = shorties.includes(this.id);
      const longRest = result.type === "long";
      if (shorty && longRest) restConfig.recoverSpellSlotTypes = new Set([]);
      if (shorty && !longRest) restConfig.recoverSpellSlotTypes = new Set(["spell", "pact"]);

      if (!this.system.spells) return;
      const types = restConfig.recoverSpellSlotTypes;
      if (!types?.size) return;
      for (const [key, slot] of Object.entries(this.system.spells)) {
        if (!types.has(slot.type)) continue;
        result.updateData[`system.spells.${key}.value`] = slot.max;
      }
    },
    "OVERRIDE",
  );
}

async function patch__getRestItemUsesRecovery() {
  libWrapper.register(
    MODULE_ID, // the package's "id" or your world's manifest "id"
    "CONFIG.Actor.documentClass.prototype._getRestItemUsesRecovery",
    async function ({ recoverShortRestUses, recoverLongRestUses, recoverDailyUses, ...config } = {}, result = {}) {
      const restConfig = CONFIG.DND5E.restTypes[config.type];

      // Shorties: Class abilities, item charges, and spell slots do NOT on recover on a long rest, but on a short rest instead.
      // Check for shorties (those who get back long rest resources on short rests instead)
      const shorties = game.settings.get(MODULE_ID, "shorties").split(/\s+/);
      const shorty = shorties.includes(this.id);
      const longRest = result.type === "long";
      if (shorty && longRest) restConfig.recoverPeriods = [];
      if (shorty && !longRest) restConfig.recoverPeriods = ["lr", "sr"];

      let recovery = Array.from(restConfig.recoverPeriods ?? []).map((p) => [p, 1]);
      if (recoverShortRestUses) recovery.unshift(["sr", 1]);
      if (recoverLongRestUses) recovery.unshift(["lr", 1]);
      if ((recoverDailyUses || config.newDay) && dnd5e.settings.calendarConfig.manualRecovery) {
        const days = dnd5e.settings.restVariant === "gritty" && config.type === "long" ? 7 : 1;
        recovery.unshift(["day", days], ["dawn", days], ["dusk", days]);
      }
      recovery = new Map(recovery);

      result.updateItems ??= [];
      result.rolls ??= [];
      for (const item of this.items) {
        if (item.isHidden || foundry.utils.getType(item.system.recoverUses) !== "function") continue;
        const { updates, rolls, destroy } = await item.system.recoverUses(recovery);
        if (destroy) {
          result.deleteItems.push(item.id);
        } else if (!foundry.utils.isEmpty(updates)) {
          const updateTarget = result.updateItems.find((i) => i._id === item.id);
          if (updateTarget) foundry.utils.mergeObject(updateTarget, updates);
          else result.updateItems.push({ _id: item.id, ...updates });
        }
        result.rolls.push(...rolls);
      }
    },
    "OVERRIDE",
  );
}
