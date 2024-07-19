import {
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  Attack,
  Defense,
  DiceService,
  Hit,
  IRule,
  Rule_AP,
  Rule_Blast,
  Rule_Reliable,
  Rule_Rending,
  Wound,
} from "../services/DiceService";
import { useState } from "react";
import { groupBy, orderBy } from "lodash";

export default function Home() {
  const [attacks, setAttacks] = useState(30);
  const [quality, setQuality] = useState(4);
  const [defense, setDefense] = useState(4);
  //const [ap, setAP] = useState(0);
  const [attackOptions, setAttackOptions] = useState({
    ap: 0,
    blast: 0,
    rending: false,
    reliable: false,
  });

  const displayRules = (x: { rules: IRule[] }) => x.rules.map((x) => x.name).join(", ");

  const [result, setResult] = useState<{
    attacks: Attack[];
    hits: Hit[];
    defense: Defense[];
    wounds: Wound[];
  }>({
    attacks: [],
    hits: [],
    wounds: [],
    defense: [],
  });

  const runTest = () => {
    console.log("");
    let attackResults = [];
    let defenseResults = [];
    let wounds = [];
    let hits = [];
    for (let i = 0; i < attacks; i++) {
      const attackRules = [];
      if (attackOptions.ap > 0) attackRules.push(new Rule_AP(attackOptions.ap));
      if (attackOptions.blast > 0) attackRules.push(new Rule_Blast(attackOptions.blast));
      if (attackOptions.rending) attackRules.push(new Rule_Rending());
      if (attackOptions.reliable) attackRules.push(new Rule_Reliable());
      
      const attack = new Attack(new DiceService(), quality, attackRules);
      hits.push(...attack.roll());
      attackResults.push(attack);
    }
    console.log(`${hits.length} hits dealt`, hits);

    for (const hit of hits) {
      const def = new Defense(new DiceService(), defense, []);
      wounds.push(...def.roll(hit));
      defenseResults.push(def);
    }

    console.log(`${wounds.length} wounds dealt`, wounds);

    setResult({ attacks: attackResults, hits, wounds, defense: defenseResults });
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

  const attackResultsByRules = groupBy(result.attacks, (x) => displayRules(x));

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
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel>AP</InputLabel>
              <Select
                value={attackOptions.ap}
                label="AP"
                onChange={(evt) =>
                  setAttackOptions((x) => ({ ...x, ap: parseInt(evt.target.value as any) }))
                }
              >
                <MenuItem value={0}>None</MenuItem>
                <MenuItem value={1}>AP(1)</MenuItem>
                <MenuItem value={2}>AP(2)</MenuItem>
                <MenuItem value={3}>AP(3)</MenuItem>
                <MenuItem value={4}>AP(4)</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Blast</InputLabel>
              <Select
                value={attackOptions.blast}
                label="Blast"
                onChange={(evt) =>
                  setAttackOptions((x) => ({ ...x, blast: parseInt(evt.target.value as any) }))
                }
              >
                <MenuItem value={0}>None</MenuItem>
                <MenuItem value={3}>Blast(3)</MenuItem>
                <MenuItem value={6}>Blast(6)</MenuItem>
                <MenuItem value={9}>Blast(9)</MenuItem>
                <MenuItem value={12}>Blast(12)</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={attackOptions.rending}
                  onChange={() => setAttackOptions((x) => ({ ...x, rending: !x.rending }))}
                />
              }
              label="Rending"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={attackOptions.reliable}
                  onChange={() => setAttackOptions((x) => ({ ...x, reliable: !x.rending }))}
                />
              }
              label="Reliable"
            />
          </Stack>
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

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item sm={6}>
          <Typography variant="h1">
            {result.hits.length} hits (
            {Object.keys(attackResultsByRules)
              .map((key) => `${attackResultsByRules[key].length}x ${key}`)
              .join("; ")}
            )
          </Typography>
          <Divider sx={{ my: 2 }} />
          {orderBy(result.attacks, "result").map((x) => (
            <Typography>
              {x.result} - {x.success ? "Hit!" : "Miss"}
            </Typography>
          ))}
        </Grid>

        <Grid item sm={6}>
          <Typography variant="h1">{result.wounds.length} wounds</Typography>
          <Divider sx={{ my: 2 }} />
          {orderBy(result.defense, "result").map((x) => (
            <Typography>
              Roll: {x.rollValue} (Result: {x.result}) - {x.success ? "Save!" : "Fail"} -{" "}
              {x.hit.rules.map((r) => r.name).join(",")}
            </Typography>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
}
