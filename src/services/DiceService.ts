interface IDiceService {
  rollD6(): number;
}

export class DiceService implements IDiceService {
  public rollD6(): number {
    return Math.floor(Math.random() * 6) + 1;
  }
}

export class MockDiceService implements IDiceService {
  constructor(public returnResult: number) {}
  public rollD6(): number {
    return this.returnResult;
  }
}

export class Attack {
  constructor(public diceService: IDiceService, public target: number, public rules: IRule[]) {}

  public roll(): Hit[] {
    for (const rule of this.rules) {
      rule.setTarget?.call(null, this);
    }

    const result = this.diceService.rollD6();
    if (result >= this.target) {
      for (const rule of this.rules) {
        rule.onSuccessfulAttack?.call(null, result);
      }

      return [new Hit(this.rules)];
    }
    return [];
  }
}

export class Hit {
  constructor(public rules: IRule[]) {}
}

export interface IRule {
  setTarget?: (attack: Attack) => void;
  onSuccessfulAttack?: (roll: number) => void;
  modifyDefenseRoll?: (roll: number) => number;
  // ...
}

export class Rule_Reliable implements IRule {
  setTarget(attack: Attack) {
    attack.target = 2;
  }
}

export class Rule_Rending implements IRule {
  public AP: Rule_AP = null;

  onSuccessfulAttack(roll: number) {
    if (roll === 6) {
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
  Reliable: Rule_Reliable,
  Rending: Rule_Rending,
};
