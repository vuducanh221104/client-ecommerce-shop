import {
  Archivo,
  Poppins,
  Lato,
  Playfair_Display,
  Open_Sans,
} from "next/font/google";

export const archivo = Archivo({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600", "700"],
  style: ["italic", "normal"],
});
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  style: ["italic", "normal"],
});
