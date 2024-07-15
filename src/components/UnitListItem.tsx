import { ISelectedUnit } from "@/data/types";
import { EquipmentService } from "@/services/EquipmentService";
import WeaponService from "@/services/WeaponService";
import { Typography, Box, Card, CardContent, Stack } from "@mui/material";
import { Fragment } from "react";

interface UnitListItemProps {
  unit: ISelectedUnit;
  control: JSX.Element;
  selected?: boolean;
  onClick?: () => void;
}

export default function UnitListItem({ unit, selected, control, onClick }: UnitListItemProps) {
  const loadout = unit.loadout || unit.equipment;

  const weaponGroups = WeaponService.groupWeapons(loadout);
  const isRenamed = unit.customName && unit.customName !== unit.name;

  return (
    <Card onClick={onClick}>
      <CardContent>
        <Stack direction="row">
          <Box flex={1}>
            <Typography>
              <span>
                {unit.customName || unit.name}{" "}
                {isRenamed && (
                  <Typography component="span" color="text.secondary">
                    ({unit.name}){" "}
                  </Typography>
                )}
              </span>
              <Typography component="span" color="text.secondary" sx={{ mr: 1 }}>
                [{unit.size}]
              </Typography>
            </Typography>
            <Typography component="span" color="text.secondary">
              <Typography variant="body2" component="span">
                Qua {unit.quality}+
              </Typography>
              <Typography variant="body2" component="span" pl={1}>
                Def {unit.defense}+
              </Typography>
            </Typography>
          </Box>
          {control}
        </Stack>
        <Typography variant="body2" color="text.secondary" mt={1}>
          {Object.values(weaponGroups).map((group: any[], i) => {
            const count = group.reduce((c, next) => c + next.count, 0);
            return (
              <Typography key={i} style={{ whiteSpace: "nowrap" }}>
                {count > 1 ? `${count}x ` : ""}
                {EquipmentService.formatString(group[0] as any)}
              </Typography>
            );
          })}
        </Typography>
        <Typography variant="body2" color="text.secondary"></Typography>
      </CardContent>
    </Card>
  );
}
