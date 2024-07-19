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
  public result: number;
  public success: boolean;
  constructor(public diceService: IDiceService, public target: number, public rules: IRule[]) {}

  public roll(): Hit[] {
    console.group("Attack");
    for (const rule of this.rules) {
      rule.setTarget?.call(rule, this);
    }

    this.result = this.diceService.rollD6();
    if (this.result >= this.target || this.result === 6) {
      const hits = [new Hit([])];
      for (const rule of this.rules) {
        rule.onSuccessfulAttack?.call(rule, this.result, hits);
      }

      // After everything is applied, assign the rules to this hits?
      for (const hit of hits) {
        hit.rules = this.rules;
      }

      this.success = true;
      console.log("success", hits);
      console.groupEnd();
      return hits;
    } else {
      console.log("fail");
      console.groupEnd();
      return [];
    }
  }
}

export class Hit {
  constructor(public rules?: IRule[]) {}
}

export class Defense {
  public rollValue: number;
  public result: number;
  public success: boolean;
  public hit: Hit;

  constructor(public diceService: IDiceService, public target: number, public rules: IRule[]) {}

  public roll(hit: Hit): Wound[] {
    this.hit = hit;
    console.group("Defend");

    this.rollValue = this.diceService.rollD6();
    this.result = this.rollValue;

    for (const rule of hit.rules) {
      this.result = rule.modifyDefenseRoll?.call(rule, this.result) ?? this.result;
    }

    console.log("after modifiers", this.result);

    if (this.result >= this.target || this.rollValue === 6) {
      console.log("success");
      this.success = true;
      console.groupEnd();
      return [];
    } else {
      console.log("failed");
      const wounds = [new Wound()];
      for (const rule of hit.rules) {
        rule.onFailedDefense?.call(rule, this.result, wounds);
      }

      console.groupEnd();
      return wounds;
    }
  }
}

export class Wound {}

export interface IRule {
  name: string;
  setTarget?: (attack: Attack) => void;
  onSuccessfulAttack?: (roll: number, hits: Hit[]) => void;
  modifyDefenseRoll?: (roll: number) => number;
  onFailedDefense?: (roll: number, wounds: Wound[]) => void;
  // ...
}

export class Rule_Reliable implements IRule {
  public name = "Reliable";
  setTarget(attack: Attack) {
    console.log("Reliable sets target to 2+");
    attack.target = 2;
  }
}

export class Rule_Blast implements IRule {
  public get name() {
    return `Blast(${this.value})`;
  }
  constructor(public value: number) {}
  onSuccessfulAttack(roll: number, hits: Hit[]) {
    console.log("Apply additional Blast hits");
    for (let i = 1; i < this.value; i++) {
      hits.push(new Hit());
    }
  }
}

export class Rule_Rending implements IRule {
  public get name() {
    return `Rending${this.AP ? " AP(4)" : ""}`;
  }

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
  public get name() {
    return `AP(${this.value})`;
  }
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
