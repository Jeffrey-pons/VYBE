export const Theme = {
  
    colors: {
      background: "#000000",  
      text: "#FFFFFF",        
      primary: "#FF5733",     
      secondary: "#FFC300",   
      violet: "#B36DFF",      
      yellow: "#FCDC12",      
      silver: "#A3A3A3",      
      violetShade1: "#CCA2FA",
      violetShade2: "#E4CCFF",
      yellowShade1: "#FBE385",
      yellowShade2: "#FFF0B6",
    },
  
    typography: {
      fontFamily: "FunnelSans-Regular" as const,
      fontFamilySecondary: "Fugaz-One" as const,
      tera: { fontSize: 48, fontWeight: "900" as const, lineHeight: 56 }, 
      giga: { fontSize: 38, fontWeight: "bold" as const, lineHeight: 48 }, 
      mega: { fontSize: 32, fontWeight: "500" as const, lineHeight: 40 }, 
      megaMedium: { fontSize: 30, fontWeight:"400" as const, lineHeight: 32 },
      megaBold: { fontSize: 28, fontWeight:"bold" as const, lineHeight: 32 },
      kilo: { fontSize: 24, fontWeight: "400" as const, lineHeight: 32 },
      kiloMedium: { fontSize: 24, fontWeight: "500" as const, lineHeight: 32 }, 
      kiloBold: { fontSize: 24, fontWeight: "bold" as const, lineHeight: 32 }, 
      hecto: { fontSize: 24, fontWeight: "400" as const, lineHeight: 30 }, 
      hectoMedium: { fontSize: 24, fontWeight: "500" as const, lineHeight: 30 }, 
      hectoBold: { fontSize: 24, fontWeight: "bold" as const, lineHeight: 30 }, 
      deca: { fontSize: 20, fontWeight: "400" as const, lineHeight: 24 }, 
      decaMedium: { fontSize: 20, fontWeight: "500" as const, lineHeight: 24 }, 
      decaBold: { fontSize: 20, fontWeight: "bold" as const, lineHeight: 24 },
      base: { fontSize: 18, fontWeight: "400" as const, lineHeight: 24 }, 
      baseMedium: { fontSize: 18, fontWeight: "500" as const, lineHeight: 24 }, 
      baseBold: { fontSize: 18, fontWeight: "bold" as const, lineHeight: 24 }, 
      deci: { fontSize: 16, fontWeight: "400" as const, lineHeight: 20 }, 
      deciMedium: { fontSize: 16, fontWeight: "500" as const, lineHeight: 20 }, 
      deciBold: { fontSize: 16, fontWeight: "bold" as const, lineHeight: 20 }, 
      micro: { fontSize: 14, fontWeight: "400" as const, lineHeight: 16 }, 
      microMedium: { fontSize: 14, fontWeight: "500" as const, lineHeight: 16 }, 
      microBold: { fontSize: 14, fontWeight: "bold" as const, lineHeight: 16 }, 
      centi: { fontSize: 12, fontWeight: "bold" as const, lineHeight: 16 }, 
    },

    alignments: {
      textCenter: { textAlign: "center" as const },
      textJustify: { textAlign: "justify" as const },
      flexStart: { justifyContent: "flex-start" as const },
      flexCenter: { justifyContent: "center" as const },
      flexEnd: { justifyContent: "flex-end" as const },
      alignStart: { alignItems: "flex-start" as const },
      alignCenter: { alignItems: "center" as const },
      alignEnd: { alignItems: "flex-end" as const },
    },
  
    spacing: {
      xs: 4,    // 0.5x
      sm: 8,    // 1x
      md: 16,   // 2x
      lg: 24,   // 3x
      xl: 32,   // 4x
      xxl: 40,  // 5x
      xxxl: 48, // 6x
    },

  };
  