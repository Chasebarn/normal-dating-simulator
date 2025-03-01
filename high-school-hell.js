// HIDDEN PLAYER STATS
const player = {
  day: 1,
  // Core stats
  sanity: 50,
  popularity: 30,
  intelligence: 40,
  depravity: 20,
  violence: 10,
  attractiveness: 50,
  
  // Hidden stats
  bodyCount: 0,
  crimesCommitted: 0,
  teacherRelationships: {},
  studentRelationships: {},
  
  // Flags
  hasGun: false,
  inCult: false,
  dealsDrugs: false,
  hasNudes: [],
  enemies: [],
  stds: [],
  detentions: 0,
  suspensions: 0,
  
  // Inventory
  inventory: [],
  
  // Unlocked paths
  unlockedPaths: []
};

// CHARACTERS
const characters = {
  // STUDENTS
  "Chad": {
    type: "jock",
    attraction: 0,
    hatred: 0,
    traits: ["homophobic", "popular", "dumb"],
    romance: false,
    flags: {},
    deathFlag: false
  },
  "Stacy": {
    type: "cheerleader",
    attraction: 0,
    hatred: 0,
    traits: ["slutty", "rich", "mean"],
    romance: false,
    flags: {},
    deathFlag: false
  },
  "Tyler": {
    type: "school_shooter",
    attraction: 0,
    hatred: 0,
    traits: ["loner", "vengeful", "armed"],
    romance: false,
    flags: {hasHitList: true},
    deathFlag: false
  },
  "Heather": {
    type: "goth",
    attraction: 0,
    hatred: 0,
    traits: ["satanist", "druggie", "depressed"],
    romance: false,
    flags: {hasCultConnection: true},
    deathFlag: false
  },
  "Jamal": {
    type: "dealer",
    attraction: 0,
    hatred: 0,
    traits: ["connected", "dangerous", "street-smart"],
    romance: false,
    flags: {sellsDrugs: true},
    deathFlag: false
  },
  
  // TEACHERS
  "Mr. Peterson": {
    type: "teacher",
    attraction: 0,
    hatred: 0,
    traits: ["pervert", "predator", "failing"],
    romance: false,
    flags: {likesMinors: true},
    deathFlag: false
  },
  "Ms. Johnson": {
    type: "teacher",
    attraction: 0,
    hatred: 0,
    traits: ["alcoholic", "depressed", "lonely"],
    romance: false,
    flags: {},
    deathFlag: false
  },
  "Principal Edwards": {
    type: "principal",
    attraction: 0,
    hatred: 0,
    traits: ["corrupt", "strict", "sadistic"],
    romance: false,
    flags: {embezzling: true},
    deathFlag: false
  }
};

// DAILY EVENT POOL - RANDOM MORNING EVENTS
const morningEvents = [
  {
    id: "bullying_encounter",
    title: "Hallway Bullying",
    description: "You witness Chad and his jock friends shoving a nerdy kid into a locker.",
    options: [
      {
        text: "Join in and help them torment the nerd",
        effects: {popularity: 10, sanity: -5, violence: 5},
        relationships: {Chad: 15, Stacy: 10},
        unlocks: ["jock_path", "bully_path"],
        flags: {becomeBully: true}
      },
      {
        text: "Tell them to fuck off and help the kid",
        effects: {popularity: -15, sanity: 5, violence: 5},
        relationships: {Chad: -20, "Tyler": 15},
        unlocks: ["outcast_path", "hero_path"],
        flags: {makeEnemies: ["Chad"]}
      },
      {
        text: "Record it on your phone to post online",
        effects: {popularity: 5, sanity: -10, depravity: 10},
        relationships: {Heather: 10},
        unlocks: ["troll_path", "viral_path"],
        flags: {hasBlackmail: true}
      },
      {
        text: "Completely ignore it like it's not happening",
        effects: {sanity: -5},
        relationships: {Tyler: -5},
        unlocks: []
      }
    ]
  },
  {
    id: "teacher_advances",
    title: "Inappropriate Attention",
    description: "Mr. Peterson asks you to stay after class, making uncomfortable comments about your appearance.",
    options: [
      {
        text: "Flirt back to get better grades",
        effects: {intelligence: 5, depravity: 15, sanity: -10},
        relationships: {"Mr. Peterson": 25},
        unlocks: ["scandal_path", "manipulation_path"],
        flags: {teacherPet: true}
      },
      {
        text: "Record him secretly and blackmail him later",
        effects: {intelligence: 10, depravity: 20, sanity: -5},
        relationships: {"Mr. Peterson": -10},
        unlocks: ["blackmail_path", "criminal_path"],
        flags: {hasBlackmailTeacher: true}
      },
      {
        text: "Tell him to fuck off and report him",
        effects: {sanity: 5, popularity: -5},
        relationships: {"Mr. Peterson": -30, "Principal Edwards": -15},
        unlocks: ["righteous_path"],
        flags: {targetedByTeacher: true}
      },
      {
        text: "Agree to meet him after school at his house",
        effects: {sanity: -20, depravity: 25, intelligence: -5},
        relationships: {"Mr. Peterson": 40},
        unlocks: ["victim_path", "corruption_path"],
        flags: {victimized: true, hasTeacherSecret: true}
      }
    ]
  },
  {
    id: "drug_offer",
    title: "Chemical Enhancement",
    description: "Jamal approaches you in the bathroom offering pills that will 'make school way more interesting'.",
    options: [
      {
        text: "Accept and take them immediately",
        effects: {sanity: -15, depravity: 20, intelligence: -10},
        relationships: {Jamal: 15, Heather: 10},
        unlocks: ["addict_path", "party_path"],
        flags: {drugUser: true},
        randomDeath: 0.05 // 5% chance of overdose
      },
      {
        text: "Buy them but save for later/resell",
        effects: {intelligence: 5, depravity: 10},
        relationships: {Jamal: 10, Chad: 5},
        unlocks: ["dealer_path", "business_path"],
        flags: {hasDrugs: true, potentialDealer: true}
      },
      {
        text: "Pretend to call the police on your phone",
        effects: {popularity: -10, sanity: 5},
        relationships: {Jamal: -25, Heather: -15},
        unlocks: ["narc_path"],
        flags: {targetedByDealers: true, makeEnemies: ["Jamal"]}
      },
      {
        text: "Ask if he has anything stronger",
        effects: {sanity: -5, depravity: 25, violence: 10},
        relationships: {Jamal: 25, Tyler: 10},
        unlocks: ["hardcore_path", "junkie_path"],
        flags: {hardcoreUser: true},
        randomDeath: 0.1 // 10% chance of overdose
      }
    ]
  },
  {
    id: "satanic_invite",
    title: "Dark Invitation",
    description: "Heather slips you a note with a pentagram drawn in what looks like blood, inviting you to 'meet the real lord of this school'.",
    options: [
      {
        text: "Show up at the meeting place alone",
        effects: {sanity: -20, depravity: 25, intelligence: 5},
        relationships: {Heather: 30, "Ms. Johnson": -10},
        unlocks: ["cult_path", "occult_path"],
        flags: {cultMember: true}
      },
      {
        text: "Bring a weapon just in case",
        effects: {sanity: -10, violence: 20, depravity: 15},
        relationships: {Heather: 15, Tyler: 20},
        unlocks: ["paranoid_path", "prepared_path"],
        flags: {hasWeapon: true, cultCurious: true}
      },
      {
        text: "Report it to the principal",
        effects: {popularity: -15, sanity: -5},
        relationships: {Heather: -30, "Principal Edwards": 10},
        unlocks: ["snitch_path"],
        flags: {targetedByCult: true, makeEnemies: ["Heather"]}
      },
      {
        text: "Show up and bring alcohol to impress them",
        effects: {popularity: 10, depravity: 20, sanity: -15},
        relationships: {Heather: 25, "Ms. Johnson": 15},
        unlocks: ["party_path", "popular_occult_path"],
        flags: {cultConnection: true, alcoholSupplier: true}
      }
    ]
  },
  {
    id: "locker_gun",
    title: "Dangerous Discovery",
    description: "While getting your books, you accidentally open the wrong locker and find a handgun wrapped in a t-shirt.",
    options: [
      {
        text: "Take it and hide it in your backpack",
        effects: {violence: 30, sanity: -15},
        relationships: {Tyler: 5},
        unlocks: ["armed_path", "dangerous_path"],
        flags: {hasGun: true},
        randomDeath: 0.05 // 5% chance of accidental discharge
      },
      {
        text: "Leave it but tell Tyler about it later",
        effects: {violence: 5, sanity: -10},
        relationships: {Tyler: 25},
        unlocks: ["accomplice_path"],
        flags: {knowsAboutGun: true, potentialShooter: true}
      },
      {
        text: "Anonymously report it to the principal",
        effects: {sanity: 10, popularity: -5},
        relationships: {Tyler: -20, "Principal Edwards": 15},
        unlocks: ["safety_path", "responsible_path"],
        flags: {preventedShooting: true, makeEnemies: ["Tyler"]}
      },
      {
        text: "Take a picture of it for blackmail",
        effects: {intelligence: 10, depravity: 15, violence: 5},
        relationships: {Tyler: -10, Jamal: 15},
        unlocks: ["blackmail_path", "manipulator_path"],
        flags: {hasGunPicture: true, blackmailMaterial: true}
      }
    ]
  },
  {
    id: "nudes_scandal",
    title: "Viral Content",
    description: "Someone's passing around Stacy's nude photos on their phone. She's crying in the bathroom.",
    options: [
      {
        text: "Ask for a copy and spread it further",
        effects: {popularity: 5, depravity: 25, sanity: -10},
        relationships: {Stacy: -40, Chad: 15},
        unlocks: ["asshole_path", "bully_path"],
        flags: {hasNudes: ["Stacy"], spreadsRumors: true}
      },
      {
        text: "Comfort her and offer to find who's responsible",
        effects: {popularity: 10, sanity: 5, violence: 5},
        relationships: {Stacy: 30, Chad: -10},
        unlocks: ["white_knight_path", "hero_path"],
        flags: {protector: true}
      },
      {
        text: "Tell her it's her fault for taking them",
        effects: {popularity: -10, sanity: -5, depravity: 10},
        relationships: {Stacy: -25, Heather: 15},
        unlocks: ["judgmental_path"],
        flags: {judgemental: true, makeEnemies: ["Stacy"]}
      },
      {
        text: "Offer to help in exchange for getting some yourself",
        effects: {depravity: 35, sanity: -15, intelligence: -10},
        relationships: {Stacy: -15, Chad: -20},
        unlocks: ["creep_path", "predator_path"],
        flags: {sexualHarasser: true, targetedByJocks: true}
      }
    ]
  }
];

// CLASSROOM EVENTS (QUIZZES)
const classEvents = [
  {
    id: "history_quiz",
    title: "History Pop Quiz",
    description: "Mr. Peterson announces a surprise quiz on World War II.",
    options: [
      {
        text: "Actually study and try your best",
        effects: {intelligence: 15, sanity: 5},
        relationships: {"Mr. Peterson": 10},
        requiresStat: {intelligence: 30},
        outcome: "You ace the quiz and feel good about yourself for once."
      },
      {
        text: "Cheat off the smart kid's paper",
        effects: {intelligence: 5, depravity: 10, sanity: -5},
        relationships: {Tyler: 5},
        requiresStat: {depravity: 20},
        outcome: "You manage to copy most answers without getting caught."
      },
      {
        text: "Write offensive answers about historical events",
        effects: {popularity: 15, depravity: 20, intelligence: -10},
        relationships: {"Mr. Peterson": -20, Chad: 15},
        requiresStat: {depravity: 40},
        outcome: "Your paper gets confiscated but you become a legend for a day."
      },
      {
        text: "Flirt with teacher to get out of it",
        effects: {intelligence: -5, depravity: 15},
        relationships: {"Mr. Peterson": 15},
        requiresStat: {attractiveness: 40},
        requiresFlag: {teacherPet: true},
        outcome: "He gives you a 'special assignment' instead of the quiz."
      }
    ]
  },
  {
    id: "sex_ed",
    title: "Sex Education Class",
    description: "Ms. Johnson awkwardly tries to teach sex ed while half the class giggles.",
    options: [
      {
        text: "Ask extremely graphic questions to make her uncomfortable",
        effects: {popularity: 20, depravity: 15, intelligence: -5},
        relationships: {"Ms. Johnson": -15, Chad: 20, Stacy: 10},
        requiresStat: {depravity: 30},
        outcome: "The class erupts in laughter as she turns bright red."
      },
      {
        text: "Pay attention and learn something useful",
        effects: {intelligence: 15, sanity: 5},
        relationships: {"Ms. Johnson": 15},
        outcome: "You actually learn something that might keep you safe later."
      },
      {
        text: "Pass around your own 'educational materials'",
        effects: {popularity: 15, depravity: 25, sanity: -10},
        relationships: {Jamal: 15, "Ms. Johnson": -20},
        requiresStat: {depravity: 25},
        outcome: "Your porn collection makes rounds through class until confiscated."
      },
      {
        text: "Share your 'personal experiences' in graphic detail",
        effects: {popularity: 10, depravity: 20, sanity: -5},
        relationships: {Stacy: 15, Heather: 10, "Ms. Johnson": -10},
        requiresStat: {depravity: 30},
        outcome: "Whether true or not, your stories become the talk of the school."
      }
    ]
  },
  {
    id: "biology_dissection",
    title: "Frog Dissection",
    description: "Today's biology class involves dissecting frogs. Some students look queasy.",
    options: [
      {
        text: "Perform the dissection properly",
        effects: {intelligence: 15, sanity: 5},
        relationships: {"Principal Edwards": 5},
        outcome: "You learn about amphibian anatomy and gain useful knowledge."
      },
      {
        text: "Mutilate the frog in disturbing ways",
        effects: {sanity: -15, violence: 20, depravity: 15},
        relationships: {Tyler: 15, Heather: 10, Chad: -5},
        requiresStat: {violence: 20},
        outcome: "Your creative dismemberment disturbs everyone around you."
      },
      {
        text: "Steal extra organs to put in people's lockers",
        effects: {popularity: -10, violence: 15, depravity: 20},
        relationships: {Heather: 20, Tyler: 15},
        requiresFlag: {hasWeapon: true},
        outcome: "Your 'prank' causes screams throughout the day."
      },
      {
        text: "Pretend to get sick to avoid the assignment",
        effects: {intelligence: -10, sanity: -5},
        relationships: {"Ms. Johnson": -5},
        outcome: "You get sent to the nurse's office and miss the class."
      }
    ]
  },
  {
    id: "group_project",
    title: "Group Project Assignment",
    description: "The principal creates random groups for a week-long project. You're paired with someone you'd rather avoid.",
    options: [
      {
        text: "Do all the work yourself to guarantee a good grade",
        effects: {intelligence: 20, sanity: -10},
        relationships: {"Principal Edwards": 10},
        requiresStat: {intelligence: 40},
        outcome: "You're exhausted but produce quality work on your own."
      },
      {
        text: "Blackmail your partner into doing everything",
        effects: {intelligence: 10, depravity: 15, sanity: -5},
        relationships: {Chad: -10, Stacy: -10},
        requiresFlag: {hasBlackmail: true},
        outcome: "They reluctantly do the work while hating you more."
      },
      {
        text: "Use the project as excuse to get closer to your partner",
        effects: {intelligence: 5, attractiveness: 10},
        relationships: {Stacy: 15, Chad: 15},
        requiresStat: {attractiveness: 35},
        outcome: "The project becomes a backdrop for your flirtation."
      },
      {
        text: "Don't do anything and accept the failing grade",
        effects: {intelligence: -15, sanity: -5, popularity: -5},
        relationships: {"Principal Edwards": -15},
        outcome: "Your partner is furious and you fail the assignment."
      }
    ]
  },
  {
    id: "gym_class",
    title: "Dodgeball Day",
    description: "It's dodgeball in gym class and Chad is loading up with balls to target the weaker students.",
    options: [
      {
        text: "Team up with Chad and dominate the game",
        effects: {popularity: 15, violence: 10, sanity: 5},
        relationships: {Chad: 20, Tyler: -15},
        requiresStat: {violence: 20},
        outcome: "You and Chad reign supreme, pelting everyone mercilessly."
      },
      {
        text: "Protect the weaker students from getting hit",
        effects: {popularity: 5, sanity: 10, violence: 5},
        relationships: {Tyler: 15, Chad: -10},
        requiresStat: {violence: 15},
        outcome: "You take hits meant for others, earning respect from some."
      },
      {
        text: "Deliberately aim for people's faces",
        effects: {popularity: -10, violence: 25, sanity: -10},
        relationships: {Chad: 10, Tyler: 10, Stacy: -15},
        requiresStat: {violence: 30},
        outcome: "You send two kids to the nurse and get detention."
      },
      {
        text: "Fake an injury to sit out",
        effects: {intelligence: 5, sanity: -5, popularity: -5},
        relationships: {Chad: -10},
        outcome: "You avoid the game but look weak to everyone."
      }
    ]
  }
];

// AFTERNOON SUMMARY EVENTS
const summaryEvents = [
  {
    id: "summary_normal_day1",
    title: "End of Day 1",
    description: "Your first day at Westlake High comes to an end. You've made some impressions, good or bad.",
    generateSummary: function(player) {
      let summary = "Day 1 Summary: ";
      
      if (player.popularity > 60) {
        summary += "You've quickly become noticed around school. ";
      } else if (player.popularity < 30) {
        summary += "You've managed to alienate people already. ";
      } else {
        summary += "You're flying under the radar so far. ";
      }
      
      if (player.depravity > 50) {
        summary += "You've shown you're willing to cross lines others won't. ";
      }
      
      if (player.violence > 40) {
        summary += "Your aggressive tendencies are becoming apparent. ";
      }
      
      if (player.sanity < 30) {
        summary += "The school is already getting to you mentally. ";
      }
      
      if (player.intelligence > 60) {
        summary += "Teachers have noticed your academic potential. ";
      }
      
      // Check relationships
      let bestRel = null;
      let bestScore = -999;
      let worstRel = null;
      let worstScore = 999;
      
      for (let char in characters) {
        if (characters[char].attraction > bestScore) {
          bestScore = characters[char].attraction;
          bestRel = char;
        }
        if (characters[char].hatred > worstScore) {
          worstScore = characters[char].hatred;
          worstRel = char;
        }
      }
      
      if (bestRel && bestScore > 15) {
        summary += `${bestRel} seems particularly interested in you. `;
      }
      
      if (worstRel && worstScore < -15) {
        summary += `${worstRel} already seems to hate your guts. `;
      }
      
      // Check flags
      if (player.flags.hasGun) {
        summary += "The weight of the gun in your backpack feels both terrifying and empowering. ";
      }
      
      if (player.flags.dealsDrugs) {
        summary += "You've started establishing yourself in the school's black market. ";
      }
      
      if (player.flags.cultMember) {
        summary += "The symbols from the cult meeting are burned into your mind. ";
      }
      
      if (player.flags.targetedByTeacher) {
        summary += "You feel Mr. Peterson's eyes following you in the hallway. ";
      }
      
      return summary;
    }
  },
  // More summary events for different days and conditions
];

// RANDOM DEATH EVENTS
const deathEvents = [
  {
    id: "drug_overdose",
    title: "Fatal Experimentation",
    description: "The pills Jamal gave you weren't what he claimed. Your heart races out of control as the edges of your vision go dark. You collapse in the bathroom stall as your organs fail. No one finds you until it's too late.",
    requires: {flags: {drugUser: true}}
  },
  {
    id: "school_shooting_victim",
    title: "Wrong Place, Wrong Time",
    description: "Gunshots echo through the hallway. Before you can react, Tyler emerges with a vacant stare and a raised weapon. You become one of several casualties in what the news will later call a tragedy that could have been prevented.",
    requires: {flags: {makeEnemies: ["Tyler"]}}
  },
  {
    id: "cult_sacrifice",
    title: "The Chosen One",
    description: "The cult meeting takes a dark turn when Heather announces that 'the lord requires fresh blood.' You realize too late that you weren't invited as a member but as an offering. The last thing you see is the circle of hooded figures closing in.",
    requires: {flags: {cultConnection: true}}
  },
  {
    id: "suicide",
    title: "The End of Suffering",
    description: "The pressures of Westlake High finally break you. The bullying, the chaos, the moral compromises - it all becomes too much. You leave a brief note and make sure no one can save you in time.",
    requires: {stats: {sanity: [0, 15]}}
  },
  {
    id: "accidental_shooting",
    title: "Misfire",
    description: "You were just checking out the gun, not realizing it was loaded with the safety off. The gunshot is deafening in your bedroom. Your parents find you, but there's nothing anyone can do.",
    requires: {flags: {hasGun: true}}
  }
];

// PROM ENDINGS
const promEndings = [
  {
    id: "prom_king_queen",
    title: "High School Royalty",
    description: "Your manipulation of the social hierarchy pays off. You and your date are crowned prom royalty to cheers and applause. No one needs to know what you did to get here.",
    requires: {stats: {popularity: [75, 100]}, flags: {}}
  },
  {
    id: "prom_massacre",
    title: "Red Prom",
    description: "You and Tyler execute your plan perfectly. The doors are chained, the lights go out, and what follows will be remembered as the darkest day in the school's history. Your names will never be forgotten.",
    requires: {stats: {violence: [80, 100], sanity: [0, 30]}, flags: {hasGun: true}}
  },
  {
    id: "teacher_scandal",
    title: "The Graduate",
    description: "Instead of attending prom, you meet Mr. Peterson at a hotel room as planned. What happens next will destroy his marriage and career once the videos leak, but the settlement money will put you through college.",
    requires: {stats: {depravity: [70, 100]}, flags: {teacherPet: true, hasBlackmailTeacher: true}}
  },
  {
    id: "cult_prom",
    title: "The Real Celebration",
    description: "While others attend their pathetic prom, you and the cult prepare for the true ceremony. Tonight, the barriers between worlds will thin, and what comes through will transform this town forever.",
    requires: {stats: {sanity: [0, 30], depravity: [70, 100]}, flags: {cultMember: true}}
  },
  {
    id: "drug_kingpin",
    title: "Business Meeting",
    description: "Prom night means big sales. You skip the dance to manage your network of dealers. The school is just the beginning - you have suppliers asking to meet about expanding to other districts.",
    requires: {stats: {intelligence: [60, 100], depravity: [60, 100]}, flags: {dealsDrugs: true}}
  },
  {
    id: "loner_ending",
    title: "Above It All",
    description: "You watch social media light up with prom photos, feeling nothing but contempt for the shallow rituals. You've seen the true nature of this place, and you're better off alone with your dark understanding.",
    requires: {stats: {popularity: [0, 30], intelligence: [70, 100]}, flags: {}}
  }
];

// Functions to manage game state
function checkRequirements(option, player) {
  // Check if player meets stat requirements
  if (option.requiresStat) {
    for (let stat in option.requiresStat) {
      if (player[stat] < option.requiresStat[stat]) {
        return false;
      }
    }
  }
  
  // Check if player has required flags
  if (option.requiresFlag) {
    for (let flag in option.requiresFlag) {
      if (!player.flags[flag]) {
        return false;
      }
    }
  }
  
  return true;
}

function applyEffects(option, player) {
  // Apply stat changes
  if (option.effects) {
    for (let stat in option.effects) {
      player[stat] += option.effects[stat];
      // Ensure stats stay within bounds
      player[stat] = Math.max(0, Math.min(100, player[stat]));
    }
  }
  
  // Apply relationship changes
  if (option.relationships) {
    for (let char in option.relationships) {
      if (option.relationships[char] > 0) {
        characters[char].attraction += option.relationships[char];
      } else {
        characters[char].hatred += Math.abs(option.relationships[char]);
      }
    }
  }
  
  // Set flags
  if (option.flags) {
    for (let flag in option.flags) {
      player.flags[flag] = option.flags[flag];
    }
  }
  
  // Add to unlocked paths
  if (option.unlocks && option.unlocks.length > 0) {
    for (let path of option.unlocks) {
      if (!player.unlockedPaths.includes(path)) {
        player.unlockedPaths.push(path);
      }
    }
  }
  
  // Check for random death
  if (option.randomDeath && Math.random() < option.randomDeath) {
    // Trigger death event
    return "death";
  }
  
  return "success";
}

function generateDailySummary(player) {
  // Find appropriate summary based on day and stats
  const applicableSummaries = summaryEvents.filter(summary => {
    // Add logic to find applicable summary based on player state
    return true; // Placeholder
  });
  
  if (applicableSummaries.length > 0) {
    // Pick random applicable summary
    const summary = applicableSummaries[Math.floor(Math.random() * applicableSummaries.length)];
    return summary.generateSummary(player);
  }
  
  return "Day ended without notable events.";
}

function checkForDeath(player) {
  // Check if player meets death conditions
  for (let death of deathEvents) {
    let eligible = true;
    
    // Check flags
    if (death.requires.flags) {
      for (let flag in death.requires.flags) {
        if (player.flags[flag] !== death.requires.flags[flag]) {
          eligible = false;
          break;
        }
      }
    }
    
    // Check stats
    if (eligible && death.requires.stats) {
      for (let stat in death.requires.stats) {
        const range = death.requires.stats[stat];
        if (player[stat] < range[0] || player[stat] > range[1]) {
          eligible = false;
          break;
        }
      }
    }
    
    if (eligible && Math.random() < 0.2) { // 20% chance if all conditions met
      return death;
    }
  }
  
  return null;
}

function getPromEnding(player) {
  // Find eligible prom endings
  const eligibleEndings = promEndings.filter(ending => {
    let eligible = true;
    
    // Check stats
    if (ending.requires.stats) {
      for (let stat in ending.requires.stats) {
        const range = ending.requires.stats[stat];
        if (player[stat] < range[0] || player[stat] > range[1]) {
          eligible = false;
          break;
        }
      }
    }
    
    // Check flags
    if (eligible && ending.requires.flags) {
      for (let flag in ending.requires.flags) {
        if (player.flags[flag] !== ending.requires.flags[flag]) {
          eligible = false;
          break;
        }
      }
    }
    
    return eligible;
  });
  
  if (eligibleEndings.length > 0) {
    // Return random eligible ending
    return eligibleEndings[Math.floor(Math.random() * eligibleEndings.length)];
  }
  
  // Default ending if none match
  return {
    id: "basic_graduation",
    title: "Just Another Graduate",
    description: "You made it through Westlake High without standing out too much. The prom is uneventful, and you graduate with the rest. Years later, few will remember you were even there."
  };
}

// Example of running a game day
function runGameDay(player) {
  // 1. Morning random event
  const randomEvent = morningEvents[Math.floor(Math.random() * morningEvents.length)];
  
  // Filter options based on requirements
  const availableOptions = randomEvent.options.filter(option => checkRequirements(option, player));
  
  // Player would choose an option here...
  const chosenOption = availableOptions[0]; // Placeholder
  
  // Apply effects
  const morningResult = applyEffects(chosenOption, player);
  
  // Check if player died
  if (morningResult === "death") {
    return {
      alive: false,
      deathEvent: checkForDeath(player) || deathEvents[0] // Fallback to first death if none match
    };
  }
  
  // 2. Class event (quiz)
  const classEvent = classEvents[Math.floor(Math.random() * classEvents.length)];
  
  // Filter quiz options
  const availableQuizOptions = classEvent.options.filter(option => checkRequirements(option, player));
  
  // Player would choose a quiz option here...
  const chosenQuizOption = availableQuizOptions[0]; // Placeholder
  
  // Apply quiz effects
  const quizResult = applyEffects(chosenQuizOption, player);
  
  // Check if player died
  if (quizResult === "death") {
    return {
      alive: false,
      deathEvent: checkForDeath(player) || deathEvents[0]
    };
  }
  
  // 3. Generate day summary
  const summary = generateDailySummary(player);
  
  // 4. Random death check (0.5% chance each day if not otherwise triggered)
  if (Math.random() < 0.005) {
    const death = checkForDeath(player);
    if (death) {
      return {
        alive: false,
        deathEvent: death
      };
    }
  }
  
  // Advance to next day
  player.day++;
  
  return {
    alive: true,
    summary: summary,
    morningEvent: randomEvent,
    morningChoice: chosenOption,
    classEvent: classEvent,
    classChoice: chosenQuizOption
  };
}

// Example of running a full game
function runFullGame() {
  let gameState = {
    player: {...player},
    alive: true,
    dailyResults: []
  };
  
  // Run 7 days
  for (let day = 1; day <= 7; day++) {
    if (!gameState.alive) break;
    
    const dayResult = runGameDay(gameState.player);
    gameState.dailyResults.push(dayResult);
    
    if (!dayResult.alive) {
      gameState.alive = false;
      gameState.deathEvent = dayResult.deathEvent;
      break;
    }
  }
  
  // If survived, get prom ending
  if (gameState.alive) {
    gameState.ending = getPromEnding(gameState.player);
  }
  
  return gameState;
}
