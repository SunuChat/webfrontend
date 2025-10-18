// Fichier : PartnersPage.jsx (refonte visuelle premium)

import {
  Box,
  Typography,
  Container,
  IconButton,
  Stack,
  Card,
  CardContent,
  Chip,
  Grid,
  Divider,
  Tooltip,
} from "@mui/material";
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

// Images
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
    twitter: "https://x.com/EPT_officiel",
    linkedin:
      "https://www.linkedin.com/in/ecole-polytechnique-thi%C3%A8s-l%E2%80%99officiel-b32426147/",
    instagram: "https://www.instagram.com/ept_e/",
    facebook: "https://www.facebook.com/eptthies?fref=ts#",
  },
  {
    name: "Jokalante",
    role: "Partenaire opérationnel et data",
    description:
      "Jokalante joue un rôle clé en fournissant des données de terrain et en accueillant des ingénieurs et stagiaires. L’entreprise appuie l’ancrage communautaire de la solution.",
    image: jokalanteImg,
    website: "https://jokalante.com/",
    email: "contact@jokalante.com",
    twitter: "https://x.com/JokalanteSN",
    linkedin: "https://www.linkedin.com/company/jokalante/posts/?feedView=all",
    instagram: "https://www.instagram.com/jokalantesn/",
    facebook: "https://www.facebook.com/jokalante?locale=fr_FR",
  },
];

export default function PartnersPage() {
  return (
    <Box sx={{ backgroundColor: "#f6f9fc" }}>
      {/* Hero */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          color: "#fff",
          background: `linear-gradient(120deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`,
        }}
      >
        <Container sx={{ py: { xs: 8, md: 12 } }}>
          <Typography
            variant="overline"
            sx={{ letterSpacing: 2, opacity: 0.9 }}
          >
            Partenariats
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              letterSpacing: "-0.02em",
              textShadow: "0 8px 24px rgba(0,0,0,0.2)",
            }}
          >
            Nos Partenaires Stratégiques
          </Typography>
          <Typography
            variant="h6"
            sx={{ maxWidth: 820, mt: 1.5, opacity: 0.95 }}
          >
            Grâce à leur soutien, SunuChat devient une réalité au service de la
            santé.
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Chip label="Innovation" sx={heroChip} />
            <Chip label="Impact social" sx={heroChip} />
            <Chip label="Confiance" sx={heroChip} />
          </Stack>
        </Container>
      </Box>

      {/* Liste partenaires */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={4}>
          {partners.map((partner, index) => (
            <Grid item xs={12} key={partner.name}>
              <PartnerCard partner={partner} reverse={index % 2 === 1} />
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: { xs: 6, md: 10 } }} />

        {/* Bandeau CTA */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            p: { xs: 3, md: 4 },
            background: `linear-gradient(120deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`,
            color: "#fff",
            boxShadow: "0 16px 48px rgba(0,0,0,0.12)",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", md: "center" }}
              justifyContent="space-between"
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                  Rejoindre l’aventure ?
                </Typography>
                <Typography sx={{ opacity: 0.95 }}>
                  Écrivez-nous pour un partenariat ou un projet pilote.
                </Typography>
              </Box>
              <Stack direction="row" spacing={1.5}>
                <Tooltip title="Nous écrire">
                  <IconButton
                    component="a"
                    href="mailto:contact@sunuchat.sn"
                    sx={{
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.5)",
                    }}
                  >
                    <Email />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Site web">
                  <IconButton
                    component="a"
                    href="https://sunuchat.sn"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.5)",
                    }}
                  >
                    <Language />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

function PartnerCard({ partner, reverse = false }) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        p: { xs: 2, md: 3 },
        background: "linear-gradient(180deg, #fff, #ffffffcc)",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
      }}
    >
      <CardContent sx={{ p: { xs: 1, md: 2 } }}>
        <Stack
          direction={{ xs: "column", md: reverse ? "row-reverse" : "row" }}
          spacing={{ xs: 2.5, md: 4 }}
          alignItems="center"
        >
          {/* Logo / Image */}
          <Box sx={{ flex: 1, width: "100%" }}>
            <Image
              src={partner.image}
              alt={partner.name}
              duration={0}
              style={{
                borderRadius: 16,
                width: "80%",
                height: "auto",
                objectFit: "contain",
                background: "#fff",
              }}
            />
          </Box>

          {/* Texte */}
          <Box sx={{ flex: 1 }}>
            <Stack spacing={1}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 900, letterSpacing: "-0.01em" }}
              >
                {partner.name}
              </Typography>
              <Chip
                label={partner.role}
                sx={{
                  width: "fit-content",
                  bgcolor: `${SECONDARY_COLOR}22`,
                  color: SECONDARY_COLOR,
                  border: `1px solid ${SECONDARY_COLOR}55`,
                  fontWeight: 600,
                }}
              />
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {partner.description}
              </Typography>

              <Stack direction="row" spacing={1.5} sx={{ pt: 1 }}>
                {partner.website && (
                  <Tooltip title="Site web">
                    <IconButton
                      component="a"
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={iconBtnNeutral}
                    >
                      <Language fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                {partner.email && (
                  <Tooltip title="Email">
                    <IconButton
                      component="a"
                      href={`mailto:${partner.email}`}
                      sx={iconBtnAccent("#D44638")}
                    >
                      <Email fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                {partner.linkedin && (
                  <Tooltip title="LinkedIn">
                    <IconButton
                      component="a"
                      href={partner.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={iconBtnAccent("#0A66C2")}
                    >
                      <LinkedIn fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                {partner.twitter && (
                  <Tooltip title="Twitter / X">
                    <IconButton
                      component="a"
                      href={partner.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={iconBtnAccent(PRIMARY_COLOR)}
                    >
                      <Twitter fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                {partner.instagram && (
                  <Tooltip title="Instagram">
                    <IconButton
                      component="a"
                      href={partner.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={iconBtnAccent("#C13584")}
                    >
                      <Instagram fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                {partner.facebook && (
                  <Tooltip title="Facebook">
                    <IconButton
                      component="a"
                      href={partner.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={iconBtnAccent(PRIMARY_COLOR)}
                    >
                      <Facebook fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

const heroChip = {
  bgcolor: "rgba(255,255,255,0.16)",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.35)",
  backdropFilter: "blur(6px)",
};

const iconBtnNeutral = {
  color: PRIMARY_COLOR,
  border: `1px solid ${PRIMARY_COLOR}33`,
};

function iconBtnAccent(color) {
  return {
    color,
    border: `1px solid ${color}33`,
  };
}
