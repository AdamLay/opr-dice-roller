import pluralize from "pluralize";
import { groupBy, flatMap } from "lodash";
import { IUpgradeGains, IUpgradeGainsItem } from "@/data/types";
import RulesService from "./RulesService";

export default class WeaponService {
  public static groupWeapons(loadout: IUpgradeGains[]) {
    const weaponsFromItems = flatMap(
      loadout.filter((e) => e.type === "ArmyBookItem"),
      (e: IUpgradeGainsItem) => e.content.filter((item) => item.type === "ArmyBookWeapon")
    );
    const weapons = loadout.filter((x) => x.attacks);
    return groupBy(
      weapons.concat(weaponsFromItems),
      (x) =>
        pluralize.singular(x.name || x.label) +
        (x as any).range +
        x.attacks +
        x.specialRules?.map((rule) => RulesService.displayName(rule)).join("")
    );
  }
}
