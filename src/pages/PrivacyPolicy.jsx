// PrivacyPolicy.jsx — SunuChat · Editorial Clean
import React from "react";
import { Box, Link } from "@mui/material";
import LegalLayout, {
  LegalH2, LegalBody, LegalList, LegalDivider,
} from "../components/LegalLayout";
import { PRIMARY_COLOR } from "../constants";

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      badge="Légal"
      title="Politique de confidentialité"
      updatedAt="23 juillet 2025"
    >
      <LegalBody>
        Chez <strong>SunuChat</strong>, nous accordons une grande importance à
        la confidentialité de vos données. Cette politique vise à vous informer
        de manière transparente sur les données que nous collectons, pourquoi
        nous les collectons et comment elles sont utilisées.
      </LegalBody>

      <LegalDivider />

      <LegalH2>1. Qui sommes-nous ?</LegalH2>
      <LegalBody>
        SunuChat est une plateforme développée par le{" "}
        <strong>Laboratoire en Traitement de l'Information et Systèmes Intelligents</strong>,
        en collaboration avec <strong>Jokalante</strong>, et financée par{" "}
        <strong>Grand Challenges Canada</strong>. Notre objectif est de permettre à
        toute personne d'accéder facilement à des informations de santé grâce à un
        chatbot intelligent.
      </LegalBody>

      <LegalH2>2. Données collectées</LegalH2>
      <LegalList
        items={[
          "Données personnelles : nom, prénom, email, numéro de téléphone",
          "Fichiers audio : enregistrements vocaux envoyés au chatbot",
          "Données de santé : uniquement si mentionnées volontairement",
          "Données techniques : adresse IP, type de navigateur, appareil utilisé",
          "Données de géolocalisation : avec votre autorisation explicite",
        ]}
      />

      <LegalH2>3. Finalité de la collecte</LegalH2>
      <LegalList
        items={[
          "Répondre à vos questions de santé",
          "Améliorer le fonctionnement du chatbot",
          "Réaliser des analyses statistiques anonymisées",
          "Garantir la sécurité de la plateforme",
          "Signaler des cas suspects aux autorités de santé, avec votre accord",
        ]}
      />

      <LegalH2>4. Stockage et sécurité</LegalH2>
      <LegalBody>
        Toutes les données sont stockées de manière sécurisée sur des serveurs
        protégés. Les enregistrements audio et informations de santé sont traités
        avec la plus grande confidentialité. Des mesures de sécurité sont en place :
        chiffrement des données, restrictions d'accès strictes et journalisation des
        accès.
      </LegalBody>

      <LegalH2>5. Partage des données</LegalH2>
      <LegalBody>
        SunuChat ne partage jamais vos données à des fins commerciales. Vos données
        peuvent être partagées uniquement avec :
      </LegalBody>
      <LegalList
        items={[
          "Les autorités sanitaires ou partenaires du projet, avec votre accord",
          "Des prestataires techniques pour assurer le bon fonctionnement de la plateforme",
        ]}
      />

      <LegalH2>6. Vos droits</LegalH2>
      <LegalBody>
        Conformément à la réglementation, vous disposez d'un droit d'accès, de
        rectification et de suppression de vos données. Vous pouvez également
        retirer votre consentement ou demander la portabilité de vos données.
        Pour toute demande, contactez-nous à{" "}
        <Link
          href="mailto:support@sunuchat.sn"
          sx={{ color: PRIMARY_COLOR, fontWeight: 500, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
        >
          support@sunuchat.sn
        </Link>.
      </LegalBody>

      <LegalH2>7. Cookies</LegalH2>
      <LegalBody>
        Nous utilisons uniquement des cookies nécessaires au bon fonctionnement du
        site. Aucun cookie publicitaire ou de tracking tiers n'est utilisé.
      </LegalBody>

      <LegalH2>8. Utilisation par des mineurs</LegalH2>
      <LegalBody>
        SunuChat est accessible à tous. Pour les utilisateurs de moins de 15 ans,
        une utilisation accompagnée d'un adulte est recommandée.
      </LegalBody>

      <LegalH2>9. Modifications</LegalH2>
      <LegalBody>
        Cette politique peut être mise à jour à tout moment. Toute modification
        sera affichée sur cette page avec la date de mise à jour.
      </LegalBody>

      <LegalH2>10. Contact</LegalH2>
      <LegalBody>
        Pour toute question concernant cette politique :{" "}
        <Link
          href="mailto:support@sunuchat.sn"
          sx={{ color: PRIMARY_COLOR, fontWeight: 500, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
        >
          support@sunuchat.sn
        </Link>
      </LegalBody>
    </LegalLayout>
  );
}