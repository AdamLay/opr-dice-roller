import {
  AppBar,
  Button,
  Container,
  Grid,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import UnitListItem from "@/components/UnitListItem";

export default function Home() {
  const [shareUrl, setShareUrl] = useState(
    "https://army-forge.onepagerules.com/share?id=chytwaO85OYD&name=Udo_HEF"
  );
  const [armyList, setArmyList] = useState(null);
  const [attacker, setAttacker] = useState(null);
  const [defender, setDefender] = useState(null);

  const handleLoadShare = async () => {
    console.log(shareUrl);
    const url = shareUrl.replace("/share", "/api/tts");
    const afRes = await axios.get(url);
    setArmyList(afRes.data);
  };

  return (
    <>
      <AppBar sx={{ position: "sticky", top: 0, zIndex: 1, px: 1 }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            OPR Dice Roller
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 2 }}>
        <Stack direction="row" spacing={2}>
          <TextField
            label="AF Share URL"
            value={shareUrl}
            onChange={(e) => setShareUrl(e.target.value)}
            sx={{ flex: 1 }}
          />
          <Button variant="contained" onClick={handleLoadShare}>
            Load Army
          </Button>
        </Stack>

        <Stack>
          <Typography>Attacker: {attacker?.name}</Typography>
          <Typography>Defender: {defender?.name}</Typography>
          <Button>Roll!</Button>
        </Stack>

        <Grid container>
          <Grid item xs={6}>
            {armyList && (
              <>
                <Stack sx={{ mb: 1 }}>
                  {armyList.units.map((x) => (
                    <UnitListItem
                      key={x.selectionId}
                      unit={x}
                      control={
                        <Stack>
                          <Button onClick={() => setAttacker(x)}>Attack</Button>
                          <Button onClick={() => setDefender(x)}>Defend</Button>
                        </Stack>
                      }
                    />
                  ))}
                </Stack>
              </>
            )}
          </Grid>
          <Grid item xs={6}>
            <pre>{armyList && JSON.stringify(armyList, null, 2)}</pre>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
