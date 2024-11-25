const RickRollReaction = () => (
  <img
    src="https://media.tenor.com/x8v1oNUOmg4AAAAM/rickroll-roll.gif"
    style={{ height: 20 }}
  />
);

export const customReactionOptions = [
  {
    Component: RickRollReaction,
    type: "rick_roll",
    name: "Rick Roll",
  },
  {
    Component: () => <>❤️</>,
    type: "love",
    name: "Heart",
  },
];
