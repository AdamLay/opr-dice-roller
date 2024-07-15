import { Container } from "@mui/material";
import {
  Attack,
  Defense,
  MockDiceService,
  Rule_AP,
  Rule_Blast,
  Rule_Rending,
} from "../services/DiceService";

export default function Home() {
  const attack = new Attack(new MockDiceService(6), 4, [
    new Rule_AP(2),
    new Rule_Rending(),
    new Rule_Blast(3),
  ]);
  const result = attack.roll();

  for (const hit of result) {
    const def = new Defense(new MockDiceService(6), 4, []);
    const wounds = def.roll(hit);
  }
  return <Container sx={{ mt: 2 }}></Container>;
}
