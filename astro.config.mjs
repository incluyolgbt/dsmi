// @ts-check
// import cloudflare from '@astrojs/cloudflare';
import vercel from "@astrojs/vercel";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

const legacyProfileRedirects = {
  "/perfil/029bf91f-e58f-4873-b6ee-b926321d72cc":
    "/perfil/david-garcia-acosta/",
  "/perfil/03496625-4789-413c-8078-0777c0c922fb":
    "/perfil/daniela-ortiz-martinez/",
  "/perfil/04c9cd57-aaeb-41b2-9579-4031dfe48955":
    "/perfil/daniel-prado-pereira/",
  "/perfil/10c1272e-047f-442d-9f09-7e4c5a8e5045": "/perfil/sante-salud-mental/",
  "/perfil/2580e075-6474-4ba8-aef4-28835360a650":
    "/perfil/cobian-perez-bocanegra/",
  "/perfil/2628fe27-5ca6-40d7-a48d-c507d7894e91":
    "/perfil/juan-antonio-melgar-vazquez/",
  "/perfil/26adea29-f484-42ab-9d32-b2238706c716":
    "/perfil/david-ubaldo-gomez-perez/",
  "/perfil/2bedcd67-16e3-4817-a885-4b50395beb1b": "/perfil/cinthia-alvarez",
  "/perfil/2e7f6dbd-4c90-4a65-96ac-f5df0210d439":
    "/perfil/interius-psicologia/",
  "/perfil/301d332f-9c79-46df-9b3a-b690da6433fa":
    "/perfil/alejandra-avalos-nieves/",
  "/perfil/357416b1-a9ea-42c4-bb46-4b004c3e7f56": "/perfil/centro-ilumina",
  "/perfil/3c8fb565-72b2-4afe-aeb2-faf77a75b561":
    "/perfil/denisse-de-la-cruz-garcia/",
  "/perfil/44dabf46-1be2-4345-bdb4-5e223bde15c8":
    "/perfil/guadalupe-galvan-cordova/",
  "/perfil/4ac2d11e-9c65-413e-8d59-e1f2a9680c71":
    "/perfil/isabel-noyola-betancourt/",
  "/perfil/4bae9e1c-4330-4bbb-92df-7d4ad8c7ecc5": "/perfil/gabo-molina-huerta/",
  "/perfil/5c6c87c2-d93c-4a6e-92ec-5f9664758732":
    "/perfil/francisco-jimenez-rodriguez/",
  "/perfil/5dce5111-6fad-4522-a94c-7dc588c2c40a":
    "/perfil/jorge-emmanuel-juarez-cortes/",
  "/perfil/651691e4-6f43-4d30-9dfe-fa7aba7cc5bd": "/perfil/luciana-matute/",
  "/perfil/712c4053-e473-4e43-b4d7-6492c9aacc5f":
    "/perfil/maximo-carrasco-rodriguez/",
  "/perfil/735011f3-1012-4fb6-9509-0f2feb1d542a":
    "/perfil/fabiola-rodriguez-vazquez/",
  "/perfil/7c99fb7c-7da6-42be-b127-2399260c43f3":
    "/perfil/guillermo-vazquez-infante/",
  "/perfil/7e05734d-3c3a-436f-b45c-ded4b139cc94":
    "/perfil/diana-lady-arredondo-hernandez/",
  "/perfil/7ed0b990-2e32-48fd-80b9-763d884ba4a4":
    "/perfil/sofia-saucedo-aguilar/",
  "/perfil/891d16dd-730d-47a9-be37-9d336799bd6f":
    "/perfil/samuel-sanchez-cortes/",
  "/perfil/8a7284af-d5a6-453f-a6d6-db11de48741e":
    "/perfil/andrea-flores-gamboa/",
  "/perfil/8ab575a8-f472-481d-9893-8b48457ddcf7":
    "/perfil/jose-alfredo-olea-pineda/",
  "/perfil/8c096bed-01a0-4d72-9505-7e111d454d07": "/perfil/lucia-rojas/",
  "/perfil/8ceb0d0d-e3ad-4d67-ab99-0f3ea7d74f90":
    "/perfil/mely-alejandra-morfin-ramirez/",
  "/perfil/960e6fd7-0d1e-493a-8d61-e98e987df89c": "/perfil/rene-ruiz-lopez/",
  "/perfil/9739f2da-ddc6-4567-a970-0e2202fb0274":
    "/perfil/romario-nunez-lopez-araiza/",
  "/perfil/a4b2d849-8ee3-4a56-bfe7-1102ec976e5a":
    "/perfil/karla-erika-zaragoza-meza/",
  "/perfil/a540f52e-3b3c-4dc5-b1e7-8bbb29b2cf03":
    "/perfil/rocio-estrada-briseno/",
  "/perfil/a9a34028-9229-4904-9751-adcd25122bb1":
    "/perfil/gilberto-lopez-baltazar/",
  "/perfil/bfef111c-4079-4f1d-92fe-a16961407c8d": "/perfil/jose-de-jesus-rizo/",
  "/perfil/ca3c1320-e4c8-4e79-8994-855a09897108":
    "/perfil/vera-lizeth-estrada-montes-de-oca/",
  "/perfil/cabf4621-4259-40cd-bb3f-1ff288a72c7e": "/perfil/enrique-davila/",
  "/perfil/d387254c-d925-4fd9-8d71-40766912a08d":
    "/perfil/brigitte-estrada-avila/",
  "/perfil/d8e50d78-9e88-482e-b1b8-b670575ea58e":
    "/perfil/elena-gamboa-olvera/",
  "/perfil/dc0d87ff-7d31-4a67-a09d-216e05eddbcb":
    "/perfil/mauricio-preciado-carpio/",
  "/perfil/e20399ce-ad7c-4c05-a53e-ebbc6d69d6d2": "/perfil/trans-salud/",
  "/perfil/e42f7420-094a-49c4-8636-61026e175529":
    "/perfil/natalia-robles-garduno/",
  "/perfil/ece5d222-708e-459e-be31-a37d3e19644f": "/perfil/cesepco/",
  "/perfil/ed84d360-873d-4906-8921-eadf4c186192":
    "/perfil/brandon-de-jesus-centeno-alvarado/",
};

export default defineConfig({
  // adapter: cloudflare(),
  adapter: vercel(),
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes("/perfil/id"),
    }),
  ],
  site: "https://saludmental.lgbt",
  redirects: {
    "/quienes-somos": "/preguntas-frecuentes/",
    "/directorio": "/perfiles/",
    "/TERMINOS_Y_CONDICIONES.pdf": "/legal/terminos-y-condiciones/",
    ...legacyProfileRedirects,
  },
});
