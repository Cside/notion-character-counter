export type CountBy = "words" | "characters";

export type Settings = {
  countBy: CountBy;
  includesSpaces: boolean;
  includesCodeBlocks: boolean;
  enabled: boolean;
};
