// WhatsApp
export const WHATSAPP_NUMBER = "+506XXXXXXXX"; // TODO: replace with actual number
export const WHATSAPP_MESSAGE = "Hola, me interesa contratar los servicios de Mega Hits 506";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

// Site
export const SITE_NAME = "Mega Hits 506";
export const SITE_DESCRIPTION =
  "Discomóvil y animación de eventos en Pérez Zeledón";
export const SITE_URL = "https://megahits506.com";

// Radio
export const ICECAST_STREAM_URL = process.env.NEXT_PUBLIC_ICECAST_STREAM_URL;
export const AZURACAST_URL = process.env.AZURACAST_URL;
export const NOW_PLAYING_REVALIDATE = 10; // seconds

// Timezone
export const TIMEZONE = "America/Costa_Rica";
