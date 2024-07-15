import pluralize from "pluralize";

export function pluralizeWrap(string, count) {
  let value = pluralize(string, count);
  if (count === undefined || (count > 1 && string !== value)) {
    const last = value[value.length - 1];
    if (last === "S") {
      value = value.substring(0, value.length - 1) + last.toLowerCase();
    }
  }
  return value;
}
