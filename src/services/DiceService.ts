interface IDiceService {
  rollD6(): number;
}

export class DiceService implements IDiceService {
  public rollD6(): number {
    const result = Math.floor(Math.random() * 6) + 1;
    console.log("Rolling d6... ", result);
    return result;
  }
}

export class MockDiceService implements IDiceService {
  constructor(public returnResult: number) {}
  public rollD6(): number {
    console.log("Rolling d6... ", this.returnResult);
    return this.returnResult;
  }
}

export class Attack {
  constructor(public diceService: IDiceService, public target: number, public rules: IRule[]) {}

  public roll(): Hit[] {
    console.group("Attack");
    for (const rule of this.rules) {
      rule.setTarget?.call(rule, this);
    }

    const result = this.diceService.rollD6();
    if (result >= this.target || result === 6) {
      console.log("Attack is successful");
      const hits = [new Hit([])];
      for (const rule of this.rules) {
        rule.onSuccessfulAttack?.call(rule, result, hits);
      }

      // After everything is applied, assign the rules to this hits?
      for (const hit of hits) {
        hit.rules = this.rules;
      }

      console.log("Hits", hits);
      console.groupEnd();
      return hits;
    } else {
      console.log("Attackhas failed");
      console.groupEnd();
      return [];
    }
  }
}

export class Hit {
  constructor(public rules?: IRule[]) {}
}

export class Defense {
  constructor(public diceService: IDiceService, public target: number, public rules: IRule[]) {}

  public roll(hit: Hit): Wound[] {
    console.group("Defend");

    const roll = this.diceService.rollD6();
    let result = roll;

    for (const rule of hit.rules) {
      result = rule.modifyDefenseRoll?.call(rule, result) ?? result;
    }

    console.log("Defense result", result);

    if (result >= this.target || roll === 6) {
      console.log("Defense is successful");

      console.groupEnd();
      return [];
    } else {
      console.log("Defense has failed");
      const wounds = [new Wound()];
      for (const rule of hit.rules) {
        rule.onFailedDefense?.call(rule, result, wounds);
      }

      console.groupEnd();
      return wounds;
    }
  }
}

export class Wound {}

export interface IRule {
  setTarget?: (attack: Attack) => void;
  onSuccessfulAttack?: (roll: number, hits: Hit[]) => void;
  modifyDefenseRoll?: (roll: number) => number;
  onFailedDefense?: (roll: number, wounds: Wound[]) => void;
  // ...
}

export class Rule_Reliable implements IRule {
  setTarget(attack: Attack) {
    console.log("Reliable sets target to 2+");
    attack.target = 2;
  }
}

export class Rule_Blast implements IRule {
  constructor(public value: number) {}
  onSuccessfulAttack(roll: number, hits: Hit[]) {
    console.log("Apply additional Blast hits");
    for (let i = 1; i < this.value; i++) {
      hits.push(new Hit());
    }
  }
}

export class Rule_Rending implements IRule {
  public AP: Rule_AP = null;

  onSuccessfulAttack(roll: number, _) {
    if (roll === 6) {
      console.log("Rending gains AP4 on a 6");
      this.AP = new Rule_AP(4);
    }
  }

  modifyDefenseRoll(roll: number): number {
    return this.AP ? this.AP.modifyDefenseRoll(roll) : roll;
  }
}

export class Rule_AP implements IRule {
  constructor(public value: number) {}

  modifyDefenseRoll(roll: number): number {
    return roll - this.value;
  }
}

const ruleMap: { [key: string]: any } = {
  AP: Rule_AP,
  Blast: Rule_Blast,
  Reliable: Rule_Reliable,
  Rending: Rule_Rending,
};
