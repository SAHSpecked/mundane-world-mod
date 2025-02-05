const MODULE_ID = "mundane-world-mod";

const ACTORS = [
  // A "Hands On" Adventure
  {
    name: "C.O.I.L.",
    id: "Awq8gebf8aik294w",
    srExhaustionRecovery: false,
    hitDiceRecoveryClasses: ["Artificer"],
  },
  {
    name: "Delta",
    id: "Dz4zLKytvQvxXwvO",
    srExhaustionRecovery: false,
    hitDiceRecoveryClasses: ["Wizard"],
  },
  {
    name: "Gale",
    id: "WUFChJU9XPoTOzhB",
    srExhaustionRecovery: false,
    hitDiceRecoveryClasses: ["Rogue"],
  },
  {
    name: "Misha",
    id: "HILjdLTI0snDyo8B",
    srExhaustionRecovery: false,
    hitDiceRecoveryClasses: ["Warlock"],
  },
  {
    name: "Ren",
    id: "uKSgASrglRkKDTAy",
    srExhaustionRecovery: true,
    hitDiceRecoveryClasses: ["Warlord", "Ranger"],
  },
  {
    name: "Tom",
    id: "KJo2Swuf9N3E6Oh5",
    srExhaustionRecovery: false,
    hitDiceRecoveryClasses: ["Vessel"],
  },
  {
    name: "Trinity",
    id: "iRckJ4akgbC7u3jd",
    srExhaustionRecovery: false,
    hitDiceRecoveryClasses: ["Paladin"],
  },
  {
    name: "Valdimira",
    id: "XYtRAXLsNF8ViFi4",
    srExhaustionRecovery: false,
    hitDiceRecoveryClasses: ["Warlock"],
  },

  // The Fellowship of the Arcane
  {
    name: "Doc Squibly",
    id: "TQdwxIuICLlIzKhC",
    srExhaustionRecovery: false,
    hitDiceRecoveryClasses: ["Bard"],
  },
  {
    name: "Kanzou",
    id: "zg3nljrQluUQbS5m",
    srExhaustionRecovery: false,
    hitDiceRecoveryClasses: ["Barbarian", "Rogue"],
  },
  {
    name: "Styx",
    id: "ZUeXvvGAeVoqaA6e",
    srExhaustionRecovery: false,
    hitDiceRecoveryClasses: ["Cleric"],
  },
  {
    name: "West",
    id: "fMuwwbHhWz78bacH",
    srExhaustionRecovery: false,
    hitDiceRecoveryClasses: ["Artificer"],
  },
  {
    name: "Whistle",
    id: "LGAA3DcTvsZuKx8H",
    srExhaustionRecovery: false,
    hitDiceRecoveryClasses: ["Monk"],
  },
];

// Patch hit dice recovery and register settings for Magic Tables
// First argument for registering settings is the module's "id" or just "core" for unmanaged settings
Hooks.on("init", () => {
  console.log("------ CHANGING MAX LEVEL TO 50 -------");
  CONFIG.DND5E.maxLevel = 50;

  console.log("------ PATCHING HIT DICE RECOVERY -------");
  patch__getRestHitDiceRecovery();

  console.log("------ PATCHING SHORTIES ITEMS & SPELLS RECOVERY -------");
  patch__rest();

  console.log("------ REGISTERING MAGIC TABLES SETTINGS -------");

  // AHOA
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

  // TFA
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
});

// Expands the list of dnd5e hit die types
Hooks.on("setup", () => {
  console.log("------ EXPANDING HIT DIE TYPES -------");
  CONFIG.DND5E.hitDieTypes = ["d4", "d6", "d8", "d10", "d12", "d20"];
});

// Exhaustion automation
Hooks.on("dnd5e.restCompleted", async (actor, result) => {
  const exhaust = actor.system.attributes.exhaustion - 1;
  if (exhaust >= 0) {
    if (result.longRest) {
      await actor.update({ "system.attributes.exhaustion": exhaust });
      await ChatMessage.create({
        content: `${actor.name} recovers a level of exhaustion: <b>${exhaust + 1} -> ${exhaust}</b>`,
      });
    } else {
      // Some actors may have short rest exhaustion recovery
      const findActorSr = ACTORS.find((obj) => obj.id == actor.id && obj.srExhaustionRecovery == true);
      if (findActorSr != undefined) {
        await actor.update({ "system.attributes.exhaustion": exhaust });
        await ChatMessage.create({
          content: `${actor.name} recovers a level of exhaustion: <b>${exhaust + 1} -> ${exhaust}</b>`,
        });
      }
    }
  }
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

// Patch functions
function patch__getRestHitDiceRecovery() {
  libWrapper.register(
    MODULE_ID, // the package's "id" or your world's manifest "id"
    "CONFIG.Actor.documentClass.prototype._getRestHitDiceRecovery",
    function ({ maxHitDice } = {}) {
      // Set maxHitDice to 0 and calculate every time
      maxHitDice = 0;

      // Grab classes as values
      let filteredClasses = Object.values(this.classes);

      // Modify available classes for the special actors and set their maxHitDice differently
      const findActor = ACTORS.find((obj) => obj.id == this.id);
      if (findActor != undefined) {
        console.log(`------ MODIFYING HIT DIE RECOVERY (${this.name}) -------`);

        // Filter out to only recovery classes
        filteredClasses = filteredClasses.filter((cla) => findActor.hitDiceRecoveryClasses.includes(cla.name));

        // Determine the number of hit dice which may be recovered by the base classes
        for (const cla of filteredClasses) {
          maxHitDice += cla.system.levels;
        }
        maxHitDice = Math.max(Math.floor(maxHitDice / 2), 1);
      } else {
        // Determine the number of hit dice which may be recovered for not special actors
        maxHitDice = Math.max(Math.floor(this.system.details.level / 2), 1);
      }

      // Sort classes in-place, assuming players prefer recovering larger hit dice first
      filteredClasses.sort((a, b) => {
        return (parseInt(b.system.hitDice.slice(1)) || 0) - (parseInt(a.system.hitDice.slice(1)) || 0);
      });

      // Update hit dice usage for classes
      let updates = [];
      let hitDiceRecovered = 0;
      for (const cla of filteredClasses) {
        const hitDiceUsed = cla.system.hitDiceUsed;
        if (hitDiceRecovered < maxHitDice && hitDiceUsed > 0) {
          const delta = Math.min(hitDiceUsed || 0, maxHitDice - hitDiceRecovered);
          hitDiceRecovered += delta;
          updates.push({
            _id: cla.id,
            "system.hitDiceUsed": hitDiceUsed - delta,
          });
        }
      }

      return { updates, hitDiceRecovered };
    },
    "OVERRIDE",
  );
}

// Styx & Gale: Class abilities, item charges, and spell slots do NOT on recover on a long rest, but on a short rest instead.
async function patch__rest() {
  libWrapper.register(
    MODULE_ID, // the package's "id" or your world's manifest "id"
    "CONFIG.Actor.documentClass.prototype._rest",
    async function _rest(config, result = {}, ...args) {
      // Check for Styx & Gale
      // const shorties = this.id == "38IE366gMr7tIPFr"; // Testing ids
      const shorties = this.id == "ZUeXvvGAeVoqaA6e" || this.id == "WUFChJU9XPoTOzhB"; // Real ids Styx & Gale
      if (shorties) console.log(`------ MODIFYING STYX RECOVERY -------`);

      if (args.length) {
        foundry.utils.logCompatibilityWarning(
          "Actor5e._rest now takes a config object and a results object as parameters.",
          { since: "DnD5e 3.1", until: "DnD5e 3.3" },
        );
        const [longRest, dhd, dhp] = args;
        config = { chat: config, newDay: result };
        config.type = longRest ? "long" : "short";
        result = { dhd, dhp };
      }

      if (foundry.utils.getType(this.system.rest) === "function" && (await this.system.rest(config, result)) === false)
        return;

      let hitPointsRecovered = 0;
      let hpActorUpdates = {};
      let hitDiceRecovered = 0;
      let hdActorUpdates = {};
      let hdItemUpdates = [];
      const rolls = [];
      const longRest = config.type === "long";
      const newDay = config.newDay === true;

      // Recover hit points & hit dice on long rest
      if (longRest) {
        ({ updates: hpActorUpdates, hitPointsRecovered } = this._getRestHitPointRecovery());
        ({ updates: hdItemUpdates, actorUpdates: hdActorUpdates, hitDiceRecovered } = this._getRestHitDiceRecovery());
      }

      // Figure out the rest of the changes
      foundry.utils.mergeObject(result, {
        dhd: (result.dhd ?? 0) + hitDiceRecovered,
        dhp: (result.dhp ?? 0) + hitPointsRecovered,
        updateData: {
          ...(hdActorUpdates ?? {}),
          ...hpActorUpdates,
          ...this._getRestResourceRecovery({
            recoverShortRestResources: !longRest,
            recoverLongRestResources: (longRest && !shorties) || (!longRest && shorties),
          }),
          ...this._getRestSpellRecovery({ recoverLong: (longRest && !shorties) || (!longRest && shorties) }),
        },
        updateItems: [
          ...(hdItemUpdates ?? []),
          ...(await this._getRestItemUsesRecovery({
            recoverShortRestUses: (!longRest && !shorties) || (longRest && !shorties) || (!longRest && shorties),
            recoverLongRestUses: (longRest && !shorties) || (!longRest && shorties),
            recoverDailyUses: newDay,
            rolls,
          })),
        ],
        longRest,
        newDay,
      });
      result.rolls = rolls;

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

      // Perform updates
      await this.update(result.updateData, { isRest: true });
      await this.updateEmbeddedDocuments("Item", result.updateItems, { isRest: true });

      // Advance the game clock
      if (config.advanceTime && config.duration > 0 && game.user.isGM) await game.time.advance(60 * config.duration);

      // Display a Chat Message summarizing the rest effects
      if (config.chat) await this._displayRestResultMessage(result, longRest);

      /**
       * A hook event that fires when the rest process is completed for an actor.
       * @function dnd5e.restCompleted
       * @memberof hookEvents
       * @param {Actor5e} actor             The actor that just completed resting.
       * @param {RestResult} result         Details on the rest completed.
       * @param {RestConfiguration} config  Configuration data for that occurred.
       */
      Hooks.callAll("dnd5e.restCompleted", this, result, config);

      // Return data summarizing the rest effects
      return result;
    },
    "OVERRIDE",
  );
}
