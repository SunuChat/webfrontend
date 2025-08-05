import { Container, Typography, Box, Link } from "@mui/material";
import { PRIMARY_COLOR } from "../constants";

export default function AccessibilityPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography
        color={PRIMARY_COLOR}
        variant="h4"
        fontWeight="bold"
        gutterBottom
      >
        Accessibilité
      </Typography>

      <Typography variant="body1" paragraph>
        SunuChat s'engage à rendre sa plateforme accessible au plus grand
        nombre, y compris aux personnes en situation de handicap, conformément à
        notre mission d'inclusion numérique.
      </Typography>

      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Engagement d’accessibilité
      </Typography>
      <Typography variant="body1" paragraph>
        Nous nous efforçons de suivre les recommandations des directives
        internationales WCAG (Web Content Accessibility Guidelines) version 2.1
        niveau AA afin d’assurer une expérience inclusive.
      </Typography>

      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Fonctionnalités mises en place
      </Typography>
      <ul>
        <li>
          <Typography variant="body1">
            Contraste suffisant entre le texte et l’arrière-plan.
          </Typography>
        </li>
        <li>
          <Typography variant="body1">
            Compatibilité avec les lecteurs d’écran.
          </Typography>
        </li>
        <li>
          <Typography variant="body1">
            Navigation possible au clavier (sans souris).
          </Typography>
        </li>
        <li>
          <Typography variant="body1">
            Textes alternatifs pour les images importantes.
          </Typography>
        </li>
      </ul>

      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Contact
      </Typography>
      <Typography variant="body1" paragraph>
        Si vous rencontrez une difficulté d’accès ou si vous avez des
        suggestions, merci de nous contacter à :{" "}
        <Link href="mailto:contact@sunuchat.com">contact@sunuchat.com</Link>
      </Typography>

      <Box mt={4}>
        <Typography variant="body2" color="text.secondary">
          Dernière mise à jour : juillet 2025
        </Typography>
      </Box>
    </Container>
  );
}
