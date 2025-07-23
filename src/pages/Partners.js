import React from "react";
import { Box, Typography, Container, Link, Stack, Grid } from "@mui/material";
import Image from "mui-image";

const partners = [
  {
    name: "Grand Challenges Canada",
    role: "Financeur principal du projet",
    description:
      "Grand Challenges Canada soutient l’innovation en santé mondiale. En finançant SunuChat, ils permettent de rendre l’IA accessible aux communautés africaines pour des questions de santé.",
    image: "../assets/images/partners/partners/gcc.jpg",
    website: "https://grand-challenge.org/",
    email: "info@grandchallenges.ca",
    twitter: "https://twitter.com/grandchallenges",
    linkedin: "https://www.linkedin.com/company/grand-challenges-canada/",
  },
  {
    name: "École Polytechnique de Thiès (EPT)",
    role: "Coordinateur académique et technique",
    description:
      "L’EPT pilote l’exécution technique et académique de SunuChat. Elle mobilise des enseignants-chercheurs et encadre les ingénieurs de recherche.",
    image: "../assets/images/partners/partners/ept.jpg",
    website: "https://ept.edu.sn/",
    email: "contact@ept.edu.sn",
    linkedin: "https://www.linkedin.com/school/ecole-polytechnique-de-thies/",
  },
  {
    name: "Jokalante",
    role: "Partenaire opérationnel et data",
    description:
      "Jokalante joue un rôle clé en fournissant des données de terrain et en accueillant des ingénieurs et stagiaires. L’entreprise appuie l’ancrage communautaire de la solution.",
    image: "../assets/images/partners/partners/jokalante.jpg",
    website: "https://jokalante.com/",
    email: "contact@jokalante.com",
    linkedin: "https://www.linkedin.com/company/jokalante/",
  },
];

export default function PartnersPage() {
  return (
    <Box>
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
          Nos Partenaires Stratégiques
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" mb={8}>
          Grâce à leur soutien, SunuChat devient une réalité au service de la
          santé.
        </Typography>

        {partners.map((partner, index) => (
          <Box
            key={partner.name}
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                md: index % 2 === 0 ? "row" : "row-reverse",
              },
              alignItems: "center",
              gap: 6,
              mb: 10,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Image
                src={partner.image}
                alt={partner.name}
                duration={0}
                height="auto"
                style={{ borderRadius: 12, maxWidth: "100%" }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {partner.name}
              </Typography>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                {partner.role}
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                {partner.description}
              </Typography>
              <Stack direction="row" spacing={3}>
                {partner.website && (
                  <Link
                    href={partner.website}
                    target="_blank"
                    rel="noopener"
                    underline="hover"
                  >
                    🌐 Site web
                  </Link>
                )}
                {partner.email && (
                  <Link href={`mailto:${partner.email}`} underline="hover">
                    📧 Email
                  </Link>
                )}
                {partner.linkedin && (
                  <Link
                    href={partner.linkedin}
                    target="_blank"
                    rel="noopener"
                    underline="hover"
                  >
                    🔗 LinkedIn
                  </Link>
                )}
                {partner.twitter && (
                  <Link
                    href={partner.twitter}
                    target="_blank"
                    rel="noopener"
                    underline="hover"
                  >
                    🐦 Twitter
                  </Link>
                )}
              </Stack>
            </Box>
          </Box>
        ))}
      </Container>
    </Box>
  );
}
