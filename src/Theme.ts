"use client";
import {
  ColorSystemOptions,
  alpha,
  experimental_extendTheme as extendTheme,
} from "@mui/material/styles";

interface SurfaceOptions {
  main: string;
  header: string;
  one: string;
  two: string;
  three: string;
  four: string;
  hover: string;
  selected: string;
  outline: string;
  contrastText: string;
}

declare module "@mui/material/styles" {
  interface PaletteOptions {
    surface: SurfaceOptions;
    brand: {
      main: string;
      primary: string;
      contrastText: string;
    };
    white: {
      main: string;
      contrastText: string;
    };
  }
  interface Palette {
    surface: SurfaceOptions;
  }
}

const lightModeColours = {
  primary: "#2D62AE",
  onPrimary: "#FFFFFF",
  success: "#50AE55",
  onSuccess: "#020F03",
  error: "#DE0306",
  surface: {
    main: "#FFFFFF",
    header: "#F2F2F2",
    one: "#FFFFFF",
    two: "#FFFFFF",
    three: "#FFFFFF",
    four: "#FFFFFF",
    hover: "rgba(15, 113, 180, 0.08)",
    selected: "rgba(15, 113, 180, 0.05)",
  },
  brand: "#2D3241",
  onBrand: "#FFFFFF",
  outline: "rgba(0, 0, 0, 0.08)",
  onSurface: {
    highEmphasis: "#2D3241",
    mediumEmphasis: "#4A5A6A",
    disabled: "#6B7885",
  },
  background: "#F2F2F2",
};

const darkModeColours = {
  primary: "#51BEF0",
  onPrimary: "#031A25",
  success: "#7BC37F",
  onSuccess: "#1B2B1C",
  error: "#FE7F81",
  surface: {
    main: "#1C1B1F",
    header: alpha("#51BEF0", 0.05),
    one: "#1F2329", //alpha("#51BEF0", 0.05),
    two: "#202830", //alpha("#51BEF0", 0.08),
    three: "#222D36", //alpha("#51BEF0", 0.11),
    four: "#23323C", //alpha("#51BEF0", 0.14),
    hover: "rgba(81, 190, 240, 0.08)",
    selected: "rgba(81, 190, 240, 0.05)",
  },
  brand: "#2D3241",
  onBrand: "#FFFFFF",
  outline: "rgba(255, 255, 255, 0.14)",
  onSurface: {
    highEmphasis: "#EBF9FF",
    mediumEmphasis: "#BEC9CF",
    disabled: "#8C949C",
  },
  background: "#1C1B1F",
};

type Colours = typeof darkModeColours;

const getPalette = (colours: Colours): ColorSystemOptions => ({
  palette: {
    primary: {
      main: colours.primary,
      contrastText: colours.onPrimary,
    },
    success: {
      main: colours.success,
      contrastText: colours.onSuccess,
    },
    error: { main: colours.error },
    AppBar: {
      darkBg: colours.surface.one,
      defaultBg: colours.brand
    },
    surface: {
      main: colours.surface.main,
      hover: colours.surface.hover,
      selected: colours.surface.selected,
      outline: colours.outline,
      contrastText: colours.primary,
      one: colours.surface.one,
      two: colours.surface.two,
      three: colours.surface.three,
      four: colours.surface.four,
      header: colours.surface.header,
    },
    brand: {
      main: colours.brand,
      primary: colours.brand,
      contrastText: colours.onBrand,
    },
    text: {
      primary: colours.onSurface.highEmphasis,
      secondary: colours.onSurface.mediumEmphasis,
      disabled: colours.onSurface.disabled,
    },
    // foreground: {
    //   primary: colours.onSurface.highEmphasis,
    //   secondary: colours.onSurface.mediumEmphasis,
    //   disabled: colours.onSurface.disabled,
    // },
    background: {
      default: colours.background,
      paper: colours.surface.one,
    },
    action: {
      hover: colours.surface.hover,
    },
    white: {
      main: "#FFFFFF",
      contrastText: colours.primary,
    },
  },
});

export const theme = extendTheme({
  colorSchemes: {
    light: getPalette(lightModeColours),
    dark: getPalette(darkModeColours),
  },
  typography: {
    fontFamily: "Source Sans Pro",
    // Headers Small
    h1: {
      fontWeight: 400,
      fontSize: "1.5rem",
      lineHeight: 1.3,
    },
    // Titles Large
    h2: {
      fontWeight: 400,
      fontSize: "1.25rem",
      lineHeight: 1.2,
    },
    // Titles Medium
    h3: {
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    // Titles Small
    h4: {
      fontWeight: 600,
      fontSize: "0.875rem",
      lineHeight: 1.4,
    },
    body2: {
      lineHeight: 1.4,
    },
    button: {
      fontWeight: 600,
      fontSize: "0.875rem",
      textTransform: "none",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: "1rem",
          fontWeight: 600,
          letterSpacing: "1.25px",
          textTransform: "none",
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 1,
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 1,
      },
      styleOverrides: {
        elevation1: {
          backgroundImage: "none",
          backgroundColor: "var(--mui-palette-surface-one)",
        },
        elevation2: {
          backgroundImage: "none",
          backgroundColor: "var(--mui-palette-surface-two)",
        },
        elevation3: {
          backgroundImage: "none",
          backgroundColor: "var(--mui-palette-surface-three)",
        },
        elevation4: {
          backgroundImage: "none",
          backgroundColor: "var(--mui-palette-surface-four)",
        },
      },
    },
  },
});
