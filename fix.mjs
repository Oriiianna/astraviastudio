import fs from "fs"; let c = fs.readFileSync("src/components/Pricing.css", "utf8"); fs.writeFileSync("src/components/Pricing.css", c.replace(/La hairline superior va como background y no como border para poder
   usar el degradado --grad-hair que ya define el sistema./, "La hairline superior va como background y no como border."))
