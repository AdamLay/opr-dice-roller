import {
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import {
  Attack,
  Defense,
  DiceService,
  MockDiceService,
  Rule_AP,
  Rule_Blast,
  Rule_Reliable,
  Rule_Rending,
} from "../services/DiceService";
import { useState } from "react";

export default function Home() {
  const [attacks, setAttacks] = useState(2);
  const [quality, setQuality] = useState(4);
  const [defense, setDefense] = useState(4);
  const runTest = () => {
    console.log("");
    let wounds = [];
    for (let i = 0; i < attacks; i++) {
      const attack = new Attack(new DiceService(), quality, [
        new Rule_AP(2),
        new Rule_Rending(),
        //new Rule_Reliable(),
        //new Rule_Blast(3),
      ]);
      const result = attack.roll();

      for (const hit of result) {
        const def = new Defense(new DiceService(), defense, []);
        wounds.push(...def.roll(hit));
      }
    }
    console.log(`${wounds.length} wounds dealt`, wounds);
  };

  const ddl = (label, value, set) => (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={(evt) => set(parseInt(evt.target.value as any))}
      >
        <MenuItem value={2}>2+</MenuItem>
        <MenuItem value={3}>3+</MenuItem>
        <MenuItem value={4}>4+</MenuItem>
        <MenuItem value={5}>5+</MenuItem>
        <MenuItem value={6}>6+</MenuItem>
      </Select>
    </FormControl>
  );

  return (
    <Container sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item sm={4}>
          <TextField
            value={attacks}
            label="Attacks"
            type="number"
            onChange={(evt) => setAttacks(parseInt(evt.target.value))}
            fullWidth
          />
        </Grid>
        <Grid item sm={4}>
          {ddl("Quality", quality, setQuality)}
        </Grid>
        <Grid item sm={4}>
          {ddl("Defense", defense, setDefense)}
        </Grid>
      </Grid>

      <Button variant="contained" onClick={runTest}>
        Run Test
      </Button>
    </Container>
  );
}
