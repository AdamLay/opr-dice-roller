import { ISpecialRule } from "@/data/types";

export default class RulesService {
  public static displayName(
    rule: ISpecialRule,
    count: number = 0,
    hideRatingValue: boolean = false
  ) {
    if (typeof rule === "string") return rule as string;

    const countStr = count > 1 ? `${count}x ` : "";
    const ratingStr = rule.rating ? `(${(rule.modify ? "+" : "") + rule.rating})` : "";
    return (
      countStr +
      rule.name +
      (hideRatingValue && ratingStr ? "(X)" : ratingStr) +
      (rule.condition ? ` ${rule.condition}` : "")
    );
  }
}
