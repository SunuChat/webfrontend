import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { PRIMARY_COLOR } from "../constants";

export default function PrivacyPolicy() {
  return (
    <Box sx={{ py: 6, backgroundColor: "#fdfdfd" }}>
      <Container maxWidth="md">
        <Typography
          variant="h4"
          fontWeight="bold"
          color={PRIMARY_COLOR}
          gutterBottom
        >
          Politique de Confidentialité – SunuChat
        </Typography>

        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Dernière mise à jour : 23 juillet 2025
        </Typography>

        <Typography paragraph>
          Chez <strong>SunuChat</strong>, nous accordons une grande importance à
          la confidentialité de vos données. Cette politique vise à vous
          informer de manière transparente sur les données que nous collectons,
          pourquoi nous les collectons et comment elles sont utilisées.
        </Typography>

        <Typography variant="h6" fontWeight="bold" gutterBottom>
          1. Qui sommes-nous ?
        </Typography>
        <Typography paragraph>
          SunuChat est une plateforme développée par le{" "}
          <strong>
            L’Équipe Lab en Traitement de l’Information et Systèmes Intelligents
          </strong>
          , en collaboration avec <strong>Jokalante</strong>, et financée par
          <strong> Grand Challenges Canada</strong>. Notre objectif est de
          permettre à toute personne d’accéder facilement à des informations de
          santé grâce à un chatbot intelligent.
        </Typography>

        <Typography variant="h6" fontWeight="bold" gutterBottom>
          2. Données collectées
        </Typography>
        <Typography component="ul">
          <li>
            Données personnelles : nom, prénom, email, numéro de téléphone
          </li>
          <li>Fichiers audio : enregistrements vocaux envoyés au chatbot</li>
          <li>Données de santé : uniquement si mentionnées volontairement</li>
          <li>
            Données techniques : adresse IP, type de navigateur, appareil
            utilisé
          </li>
          <li>Données de géolocalisation : avec votre autorisation</li>
        </Typography>

        <Typography variant="h6" fontWeight="bold" gutterBottom>
          3. Finalité de la collecte
        </Typography>
        <Typography component="ul">
          <li>Répondre à vos questions de santé</li>
          <li>Améliorer le fonctionnement du chatbot</li>
          <li>Réaliser des analyses statistiques (anonymisées)</li>
          <li>Garantir la sécurité de la plateforme</li>
          <li>Signaler des cas suspects aux autorités (avec votre accord)</li>
        </Typography>

        <Typography variant="h6" fontWeight="bold" gutterBottom>
          4. Stockage et sécurité
        </Typography>
        <Typography paragraph>
          Toutes les données sont stockées de manière sécurisée sur des serveurs
          protégés. Les enregistrements audio et informations de santé sont
          traités avec la plus grande confidentialité. Des mesures de sécurité
          sont en place : chiffrement, restrictions d’accès, journalisation.
        </Typography>

        <Typography variant="h6" fontWeight="bold" gutterBottom>
          5. Partage des données
        </Typography>
        <Typography paragraph>
          SunuChat ne partage jamais vos données à des fins commerciales. Vos
          données peuvent être partagées uniquement avec :
        </Typography>
        <Typography component="ul">
          <li>
            Les autorités sanitaires ou partenaires du projet (avec votre
            accord)
          </li>
          <li>
            Des prestataires techniques pour assurer le bon fonctionnement de la
            plateforme
          </li>
        </Typography>

        <Typography variant="h6" fontWeight="bold" gutterBottom>
          6. Vos droits
        </Typography>
        <Typography paragraph>
          Conformément à la réglementation, vous avez le droit d’accéder, de
          rectifier ou de supprimer vos données. Vous pouvez aussi retirer votre
          consentement ou demander la portabilité de vos données. Pour toute
          demande : <strong>support@sunuchat.org</strong>.
        </Typography>

        <Typography variant="h6" fontWeight="bold" gutterBottom>
          7. Cookies
        </Typography>
        <Typography paragraph>
          Nous utilisons uniquement des cookies nécessaires au bon
          fonctionnement du site. Aucun cookie publicitaire ou de tracking n’est
          utilisé.
        </Typography>

        <Typography variant="h6" fontWeight="bold" gutterBottom>
          8. Utilisation par des mineurs
        </Typography>
        <Typography paragraph>
          SunuChat est accessible à tous. Pour les utilisateurs de moins de 15
          ans, une utilisation accompagnée est recommandée.
        </Typography>

        <Typography variant="h6" fontWeight="bold" gutterBottom>
          9. Modifications
        </Typography>
        <Typography paragraph>
          Cette politique peut être mise à jour. Toute modification sera
          affichée sur cette page avec la date de mise à jour.
        </Typography>

        <Typography variant="h6" fontWeight="bold" gutterBottom>
          10. Contact
        </Typography>
        <Typography paragraph>
          Pour toute question concernant cette politique : 📩{" "}
          <strong>support@sunuchat.org</strong>
        </Typography>
      </Container>
    </Box>
  );
}
