// TermsPage.jsx — SunuChat · Editorial Clean
import React from "react";
import { Link } from "@mui/material";
import LegalLayout, {
  LegalH2, LegalBody, LegalList, LegalDivider,
} from "../components/LegalLayout";
import { PRIMARY_COLOR } from "../constants";

export default function TermsPage() {
  return (
    <LegalLayout
      badge="Légal"
      title="Conditions générales d'utilisation"
      updatedAt="23 juillet 2025"
    >
      <LegalBody>
        Bienvenue sur <strong>SunuChat</strong>. Veuillez lire attentivement les
        présentes Conditions Générales d'Utilisation avant d'utiliser notre
        service. En accédant à SunuChat, vous acceptez les termes ci-dessous.
      </LegalBody>

      <LegalDivider />

      <LegalH2>1. Présentation de la plateforme</LegalH2>
      <LegalBody>
        SunuChat est un projet porté par le{" "}
        <strong>Laboratoire des Sciences et Technologies de l'Informatique</strong>{" "}
        de l'<strong>École Polytechnique de Thiès</strong>. Il vise à offrir au
        grand public un chatbot intelligent pour poser des questions relatives à
        la santé, de manière simple, sécurisée et multilingue.
      </LegalBody>

      <LegalH2>2. Accès au service</LegalH2>
      <LegalBody>
        L'accès à SunuChat est gratuit et ouvert à tous. Certaines fonctionnalités
        nécessitent la création d'un compte, par exemple pour accéder à l'historique
        des conversations. Vous êtes responsable de la confidentialité de vos
        identifiants de connexion.
      </LegalBody>

      <LegalH2>3. Données collectées</LegalH2>
      <LegalBody>
        En utilisant SunuChat, vous acceptez que les données suivantes soient
        collectées :
      </LegalBody>
      <LegalList
        items={[
          "Nom, prénom, adresse email, numéro de téléphone",
          "Fichiers audio envoyés au chatbot",
          "Données de santé échangées lors des conversations",
          "Données de géolocalisation, avec votre autorisation",
        ]}
      />

      <LegalH2>4. Contenus publiés</LegalH2>
      <LegalBody>
        Toute question posée est considérée comme un contenu utilisateur. En
        utilisant SunuChat, vous vous engagez à ne pas diffuser de contenu
        illicite, nuisible ou contraire aux bonnes mœurs. L'équipe se réserve le
        droit de suspendre un compte en cas d'abus avéré.
      </LegalBody>

      <LegalH2>5. Propriété intellectuelle</LegalH2>
      <LegalBody>
        Le code source, les modèles d'IA, les interfaces et l'identité visuelle de
        SunuChat sont protégés par les lois en vigueur sur la propriété
        intellectuelle. Toute reproduction ou usage commercial sans autorisation
        écrite préalable est strictement interdit.
      </LegalBody>

      <LegalH2>6. Responsabilité</LegalH2>
      <LegalBody>
        Les réponses fournies par le chatbot sont générées par intelligence
        artificielle à titre <strong>purement informatif</strong>. Elles ne
        remplacent en aucun cas l'avis d'un professionnel de santé qualifié.
        L'utilisateur reste seul responsable de l'usage qu'il fait des
        informations reçues.
      </LegalBody>

      <LegalH2>7. Résiliation de compte</LegalH2>
      <LegalBody>
        SunuChat peut suspendre ou supprimer un compte en cas d'activité
        frauduleuse, d'abus, ou sur demande expresse de l'utilisateur concerné.
      </LegalBody>

      <LegalH2>8. Accessibilité internationale</LegalH2>
      <LegalBody>
        La plateforme est accessible depuis plusieurs pays. L'utilisateur s'engage
        à respecter les lois et réglementations locales en vigueur dans son pays
        de résidence.
      </LegalBody>

      <LegalH2>9. Modifications des CGU</LegalH2>
      <LegalBody>
        Les présentes Conditions peuvent être modifiées à tout moment. En
        continuant à utiliser la plateforme après une mise à jour, vous acceptez
        les nouvelles conditions. La date de dernière mise à jour est indiquée en
        haut de cette page.
      </LegalBody>

      <LegalH2>10. Contact</LegalH2>
      <LegalBody>
        Pour toute question relative aux présentes CGU :{" "}
        <Link
          href="mailto:contact@sunuchat.sn"
          sx={{ color: PRIMARY_COLOR, fontWeight: 500, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
        >
          contact@sunuchat.sn
        </Link>{" "}
        · {" "}
        <Link
          href="https://sunuchat.sn"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: PRIMARY_COLOR, fontWeight: 500, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
        >
          sunuchat.sn
        </Link>
      </LegalBody>
    </LegalLayout>
  );
}