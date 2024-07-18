import {
  Button,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
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
  const [ap, setAP] = useState(0);
  const runTest = () => {
    console.log("");
    let wounds = [];
    let hits = [];
    for (let i = 0; i < attacks; i++) {
      const attackRules = [];
      if (ap > 0) attackRules.push(new Rule_AP(ap));
      const attack = new Attack(new DiceService(), quality, [
        //new Rule_AP(2),
        //new Rule_Rending(),
        //new Rule_Reliable(),
        //new Rule_Blast(3),
      ]);
      hits.push(...attack.roll());
    }
    console.log(`${hits.length} hits dealt`, hits);

    for (const hit of hits) {
      const def = new Defense(new DiceService(), defense, []);
      wounds.push(...def.roll(hit));
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
    <Container sx={{ pt: 2 }}>
      <Typography variant="h3" sx={{ mb: 2 }}>
        Attacker
      </Typography>
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
          <FormControl fullWidth>
            <InputLabel>AP</InputLabel>
            <Select
              value={ap}
              label="AP"
              onChange={(evt) => setAP(parseInt(evt.target.value as any))}
            >
              <MenuItem value={0}>None</MenuItem>
              <MenuItem value={1}>AP(1)</MenuItem>
              <MenuItem value={2}>AP(2)</MenuItem>
              <MenuItem value={3}>AP(3)</MenuItem>
              <MenuItem value={4}>AP(4)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h3" sx={{ mb: 2 }}>
        Defender
      </Typography>

      <Grid container spacing={2}>
        <Grid item sm={4}>
          {ddl("Defense", defense, setDefense)}
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Button variant="contained" onClick={runTest}>
        Run Test
      </Button>
    </Container>
  );
}
