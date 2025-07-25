import React from "react";
import { Box, Typography, Container, IconButton, Stack } from "@mui/material";
import Image from "mui-image";
import {
  Language,
  Email,
  LinkedIn,
  Twitter,
  Instagram,
  Facebook,
} from "@mui/icons-material";
import { PRIMARY_COLOR, SECONDARY_COLOR } from "../constants";
import gccImg from "../assets/images/partners/gcc.jpg";
import eptImg from "../assets/images/partners/ept.jpg";
import jokalanteImg from "../assets/images/partners/jokalante.png";

const partners = [
  {
    name: "Grand Challenges Canada",
    role: "Financeur principal du projet",
    description:
      "Grand Challenges Canada soutient l’innovation en santé mondiale. En finançant SunuChat, ils permettent de rendre l’IA accessible aux communautés sénégalaises pour des questions de santé.",
    image: gccImg,
    website: "https://www.grandchallenges.ca/",
    email: "info@grandchallenges.ca",
    twitter: "https://twitter.com/grandchallenges",
    linkedin: "https://www.linkedin.com/company/grand-challenges-canada/",
    instagram: "https://www.instagram.com/grandchallengescanada/",
    facebook: "https://www.facebook.com/grandchallengescanada",
  },
  {
    name: "École Polytechnique de Thiès (EPT)",
    role: "Coordinateur académique et technique",
    description:
      "L’EPT pilote l’exécution technique et académique de SunuChat. Elle mobilise des enseignants-chercheurs et encadre les ingénieurs de recherche.",
    image: eptImg,
    website: "https://ept.edu.sn/",
    email: "ept@ept.sn",
    twitter: "https://twitter.com/epthies",
    linkedin: "https://www.linkedin.com/school/ecole-polytechnique-de-thies/",
    instagram: "https://www.instagram.com/epthies/",
    facebook: "https://www.facebook.com/ept.officiel",
  },
  {
    name: "Jokalante",
    role: "Partenaire opérationnel et data",
    description:
      "Jokalante joue un rôle clé en fournissant des données de terrain et en accueillant des ingénieurs et stagiaires. L’entreprise appuie l’ancrage communautaire de la solution.",
    image: jokalanteImg,
    website: "https://jokalante.com/",
    email: "contact@jokalante.com",
    twitter: "https://twitter.com/Jokalante",
    linkedin: "https://www.linkedin.com/company/jokalante/",
    instagram: "https://www.instagram.com/jokalante.sn/",
    facebook: "https://www.facebook.com/jokalante.sn",
  },
];

export default function PartnersPage() {
  return (
    <Box>
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography
          color={PRIMARY_COLOR}
          variant="h3"
          fontWeight="bold"
          align="center"
          gutterBottom
        >
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
                style={{ borderRadius: 12, height: "unset", width: "unset" }}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {partner.name}
              </Typography>
              <Typography
                color={SECONDARY_COLOR}
                variant="subtitle1"
                fontWeight="medium"
                gutterBottom
              >
                {partner.role}
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                {partner.description}
              </Typography>

              <Stack direction="row" spacing={2}>
                {partner.website && (
                  <IconButton
                    component="a"
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: "#6A1B9A" }}
                  >
                    <Language />
                  </IconButton>
                )}
                {partner.email && (
                  <IconButton
                    component="a"
                    href={`mailto:${partner.email}`}
                    sx={{ color: "#D44638" }}
                  >
                    <Email />
                  </IconButton>
                )}
                {partner.linkedin && (
                  <IconButton
                    component="a"
                    href={partner.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: PRIMARY_COLOR }}
                  >
                    <LinkedIn />
                  </IconButton>
                )}
                {partner.twitter && (
                  <IconButton
                    component="a"
                    href={partner.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: PRIMARY_COLOR }}
                  >
                    <Twitter />
                  </IconButton>
                )}
                {partner.instagram && (
                  <IconButton
                    component="a"
                    href={partner.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: "#C13584" }}
                  >
                    <Instagram />
                  </IconButton>
                )}
                {partner.facebook && (
                  <IconButton
                    component="a"
                    href={partner.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: PRIMARY_COLOR }}
                  >
                    <Facebook />
                  </IconButton>
                )}
              </Stack>
            </Box>
          </Box>
        ))}
      </Container>
    </Box>
  );
}
