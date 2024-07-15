import { IUpgradeGains, IUpgradeGainsItem, IUpgradeGainsWeapon } from "@/data/types";
import RulesService from "./RulesService";
import { pluralizeWrap } from "./Helpers";

export class EquipmentService {
  static formatString(eqp: IUpgradeGains): string | undefined {
    try {
      const parts = [];
      const name = pluralizeWrap(eqp.name ?? eqp.label, eqp.count || 1);
      const attacks = eqp.attacks ? `A${eqp.attacks}` : null;
      if (attacks) {
        const weapon = eqp as IUpgradeGainsWeapon;
        parts.push(weapon.range ? `${weapon.range}"` : null);
      }
      parts.push(attacks);
      const rules = eqp.specialRules?.map((r) => RulesService.displayName(r)) ?? [];
      parts.push(...rules);
      if (eqp.type === "ArmyBookItem") {
        const item = eqp as IUpgradeGainsItem;
        parts.push(...item.content.map((c) => this.formatString(c)));
      }

      const displayParts = parts.filter((m) => !!m);

      return displayParts.length > 0 ? `${name} (${displayParts.join(", ")})` : name; // comma separated list
    } catch (e) {
      console.error(e, eqp);
    }
  }
}
