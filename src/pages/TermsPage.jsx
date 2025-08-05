// src/pages/TermsPage.js
import React from "react";
import { Box, Container, Typography, Divider } from "@mui/material";
import { PRIMARY_COLOR } from "../constants";

export default function TermsPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography
        color={PRIMARY_COLOR}
        variant="h4"
        gutterBottom
        fontWeight="bold"
      >
        Conditions Générales d’Utilisation (CGU) de SunuChat
      </Typography>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Dernière mise à jour : [à compléter]
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography paragraph>
        Bienvenue sur SunuChat, une plateforme de discussion intelligente dédiée
        à la santé. Veuillez lire attentivement les présentes Conditions
        Générales d’Utilisation (CGU) avant d’utiliser notre service. En
        accédant à SunuChat, vous acceptez les termes ci-dessous.
      </Typography>

      <Section title="1. Présentation de la plateforme">
        SunuChat est un projet porté par le{" "}
        <strong>
          Laboratoire des Sciences et Technologies de l’Informatique
        </strong>{" "}
        de l’<strong>École Polytechnique de Thiès</strong>. Il vise à offrir au
        grand public (adultes, adolescents et enfants) un chatbot intelligent
        pour poser des questions relatives à la santé, de manière simple,
        sécurisée et multilingue.
      </Section>

      <Section title="2. Accès au service">
        L’accès à SunuChat est gratuit et ouvert à tous. Toutefois, certaines
        fonctionnalités nécessitent la création d’un compte (ex. : historique
        des conversations). Vous êtes responsable de la confidentialité de vos
        identifiants de connexion.
      </Section>

      <Section title="3. Données collectées">
        En utilisant SunuChat, vous acceptez que les données suivantes soient
        collectées : nom, prénom, email, numéro, fichiers audio, données de
        santé échangées avec le chatbot, données de géolocalisation.
      </Section>

      <Section title="4. Contenus publiés">
        Toute question posée est considérée comme un contenu utilisateur. En
        utilisant SunuChat, vous vous engagez à ne pas diffuser de contenu
        illicite ou nuisible. L’équipe se réserve le droit de suspendre un
        compte en cas d’abus.
      </Section>

      <Section title="5. Propriété intellectuelle">
        Le code source, les modèles d’IA, les interfaces et l’identité visuelle
        de SunuChat sont protégés. Toute reproduction ou usage commercial sans
        autorisation est interdit.
      </Section>

      <Section title="6. Responsabilité">
        Les réponses fournies sont générées par IA à titre informatif
        uniquement. Elles ne remplacent pas l’avis d’un professionnel de santé.
        L’utilisateur reste responsable de l’usage des informations.
      </Section>

      <Section title="7. Résiliation de compte">
        SunuChat peut suspendre ou supprimer un compte en cas d’activité
        frauduleuse, abusive, ou sur demande de l’utilisateur.
      </Section>

      <Section title="8. Accessibilité internationale">
        La plateforme est accessible depuis plusieurs pays. L’utilisateur
        s’engage à respecter les lois locales en vigueur.
      </Section>

      <Section title="9. Modifications">
        Les CGU peuvent être modifiées à tout moment. En continuant à utiliser
        la plateforme après mise à jour, vous acceptez les nouvelles conditions.
      </Section>

      <Section title="10. Contact">
        Pour toute question : <br />
        📧 contact@sunuchat.sn <br />
        🌐 https://sunuchat.sn
      </Section>
    </Container>
  );
}

function Section({ title, children }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {children}
      </Typography>
    </Box>
  );
}
