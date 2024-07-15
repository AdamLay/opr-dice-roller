import { Attack, MockDiceService, Rule_AP, Rule_Reliable, Rule_Rending } from "../services/DiceService";
import { describe, expect, test } from "@jest/globals";

const getMock = (result) => new MockDiceService(result);

test("Basic roll attack", () => {
  const attack = new Attack(getMock(6), 4, []);

  const result = attack.roll();

  expect(result.length).toEqual(1);
});

test("AP Modifies Defense", () => {
  const ap = new Rule_AP(2);

  const result = ap.modifyDefenseRoll(6);

  expect(result).toEqual(4);
});

// #region Rending

test("Rending roll of 6", () => {
  const rending = new Rule_Rending();

  rending.onSuccessfulAttack(6);

  const result = rending.modifyDefenseRoll(6);

  expect(result).toEqual(2);
});

test("Rending roll of not 6", () => {
  const rending = new Rule_Rending();

  rending.onSuccessfulAttack(4);

  const result = rending.modifyDefenseRoll(6);

  expect(result).toEqual(6);
});

// #endregion

//#region Reliable

test("Reliable", () => {
  const attack = new Attack(getMock(2), 4, [new Rule_Reliable()]);

  const result = attack.roll();

  expect(result.length).toEqual(1);
});

//#endregion
