// PartnersPage.jsx — SunuChat · Editorial Clean
import React from "react";
import {
  Box, Container, Typography, Grid, Stack, Chip,
  IconButton, Tooltip, Link,
} from "@mui/material";
import LanguageOutlinedIcon  from "@mui/icons-material/LanguageOutlined";
import EmailOutlinedIcon     from "@mui/icons-material/EmailOutlined";
import LinkedInIcon          from "@mui/icons-material/LinkedIn";
import TwitterIcon           from "@mui/icons-material/Twitter";
import InstagramIcon         from "@mui/icons-material/Instagram";
import FacebookIcon          from "@mui/icons-material/Facebook";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import gccImg       from "../assets/images/partners/gcc.jpg";
import gcdImg       from "../assets/images/partners/gcs.png";
import eptImg       from "../assets/images/partners/ept.jpg";
import jokalanteImg from "../assets/images/partners/jokalante.png";

import {
  PRIMARY_COLOR, SECONDARY_COLOR,
  BG_PAGE, BG_WHITE, BG_SECTION_ALT,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
  BORDER_COLOR, FONT_SANS, FONT_SERIF,
  SHADOW_CARD, SHADOW_CARD_HOVER,
} from "../constants";

const partners = [
  {
    name: "Grand Challenges Canada",
    role: "Financeur principal",
    tag: "Financement",
    description:
      "Grand Challenges Canada soutient l'innovation en santé mondiale. En finançant SunuChat, ils permettent de rendre l'IA accessible aux communautés sénégalaises pour des questions de santé.",
    image: gccImg,
    website:  "https://www.grandchallenges.ca/",
    email:    "info@grandchallenges.ca",
    twitter:  "https://twitter.com/grandchallenges",
    linkedin: "https://www.linkedin.com/company/grand-challenges-canada/",
    instagram:"https://www.instagram.com/grandchallengescanada/",
    facebook: "https://www.facebook.com/grandchallengescanada",
  },
  {
    name: "Grand Challenges Sénégal",
    role: "Exécuteur du projet & partenaire local",
    tag: "Exécution",
    description:
      "Grand Challenges Sénégal est un fonds d'innovation à but non lucratif hébergé par la fondation Institut Pasteur de Dakar (IPD). Lancé en 2022 par le gouvernement sénégalais, GCS pilote l'exécution locale de SunuChat et ancre le projet dans l'écosystème de l'innovation en santé publique en Afrique de l'Ouest.",
    image: gcdImg,
    website:  "https://grandchallenges.sn/",
    email:    "info@grandchallenges.ca",
    twitter:  "https://twitter.com/grandchallenges",
    linkedin: "https://www.linkedin.com/company/grand-challenges-canada/",
    instagram:"https://www.instagram.com/grandchallengescanada/",
    facebook: "https://www.facebook.com/grandchallengescanada",
  },
  {
    name: "École Polytechnique de Thiès",
    role: "Coordinateur académique & technique",
    tag: "Académique",
    description:
      "L'EPT pilote l'exécution technique et académique de SunuChat. Elle mobilise des enseignants-chercheurs et encadre les ingénieurs de recherche.",
    image: eptImg,
    website:  "https://ept.edu.sn/",
    email:    "ept@ept.sn",
    twitter:  "https://x.com/EPT_officiel",
    linkedin: "https://www.linkedin.com/in/ecole-polytechnique-thi%C3%A8s-l%E2%80%99officiel-b32426147/",
    instagram:"https://www.instagram.com/ept_e/",
    facebook: "https://www.facebook.com/eptthies",
  },
  {
    name: "Jokalante",
    role: "Partenaire opérationnel & data",
    tag: "Terrain",
    description:
      "Jokalante joue un rôle clé en fournissant des données de terrain et en accueillant des ingénieurs et stagiaires. L'entreprise appuie l'ancrage communautaire de la solution.",
    image: jokalanteImg,
    website:  "https://jokalante.com/",
    email:    "contact@jokalante.com",
    twitter:  "https://x.com/JokalanteSN",
    linkedin: "https://www.linkedin.com/company/jokalante/",
    instagram:"https://www.instagram.com/jokalantesn/",
    facebook: "https://www.facebook.com/jokalante",
  },
];

function SocialBtn({ href, label, icon, color }) {
  return (
    <Tooltip title={label}>
      <IconButton
        component="a"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        size="small"
        sx={{
          width: 32, height: 32,
          borderRadius: "8px",
          color: TEXT_MUTED,
          bgcolor: "rgba(0,0,0,0.04)",
          "&:hover": { color, bgcolor: `${color}12` },
          transition: "all .15s",
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
}

function PartnerCard({ partner, index }) {
  const reverse = index % 2 === 1;

  return (
    <Box
      sx={{
        bgcolor: BG_WHITE,
        border: `1px solid ${BORDER_COLOR}`,
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: SHADOW_CARD,
        transition: "box-shadow .2s",
        "&:hover": { boxShadow: SHADOW_CARD_HOVER },
      }}
    >
      <Grid
        container
        direction={{ xs: "column", md: reverse ? "row-reverse" : "row" }}
      >
        <Grid
          item xs={12} md={4}
          sx={{
            bgcolor: BG_SECTION_ALT,
            borderRight: { md: reverse ? "none" : `1px solid ${BORDER_COLOR}` },
            borderLeft:  { md: reverse ? `1px solid ${BORDER_COLOR}` : "none" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 3, md: 4 },
            minHeight: { xs: 180, md: "auto" },
          }}
        >
          <Box
            component="img"
            src={partner.image}
            alt={partner.name}
            sx={{
              maxWidth: "100%",
              maxHeight: 140,
              objectFit: "contain",
              borderRadius: "8px",
            }}
          />
        </Grid>

        <Grid item xs={12} md={8} sx={{ p: { xs: 3, md: 4 } }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" gap={1}>
              <Typography
                sx={{
                  fontFamily: FONT_SERIF, fontWeight: 600,
                  fontSize: { xs: "1.1rem", md: "1.3rem" },
                  color: TEXT_PRIMARY, letterSpacing: "-0.01em",
                }}
              >
                {partner.name}
              </Typography>
              <Chip
                label={partner.tag}
                size="small"
                sx={{
                  fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.7rem",
                  height: 22,
                  bgcolor: `${SECONDARY_COLOR}18`,
                  color: "#5a7019",
                  border: `1px solid ${SECONDARY_COLOR}44`,
                }}
              />
            </Stack>

            <Typography
              sx={{
                fontFamily: FONT_SANS, fontWeight: 500, fontSize: "0.8rem",
                letterSpacing: "0.06em", textTransform: "uppercase",
                color: PRIMARY_COLOR,
              }}
            >
              {partner.role}
            </Typography>

            <Typography
              sx={{ fontFamily: FONT_SANS, fontSize: "0.9rem", color: TEXT_SECONDARY, lineHeight: 1.75 }}
            >
              {partner.description}
            </Typography>

            <Stack direction="row" spacing={0.75} flexWrap="wrap" pt={0.5}>
              {partner.website && (
                <SocialBtn href={partner.website} label="Site web" color={PRIMARY_COLOR}
                  icon={<LanguageOutlinedIcon sx={{ fontSize: 16 }} />} />
              )}
              {partner.email && (
                <SocialBtn href={`mailto:${partner.email}`} label="Email" color="#D44638"
                  icon={<EmailOutlinedIcon sx={{ fontSize: 16 }} />} />
              )}
              {partner.linkedin && (
                <SocialBtn href={partner.linkedin} label="LinkedIn" color="#0A66C2"
                  icon={<LinkedInIcon sx={{ fontSize: 16 }} />} />
              )}
              {partner.twitter && (
                <SocialBtn href={partner.twitter} label="Twitter / X" color={PRIMARY_COLOR}
                  icon={<TwitterIcon sx={{ fontSize: 16 }} />} />
              )}
              {partner.instagram && (
                <SocialBtn href={partner.instagram} label="Instagram" color="#C13584"
                  icon={<InstagramIcon sx={{ fontSize: 16 }} />} />
              )}
              {partner.facebook && (
                <SocialBtn href={partner.facebook} label="Facebook" color="#1877F2"
                  icon={<FacebookIcon sx={{ fontSize: 16 }} />} />
              )}
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default function PartnersPage() {
  return (
    <Box sx={{ bgcolor: BG_PAGE }}>
      <Box sx={{ bgcolor: BG_WHITE, borderBottom: `1px solid ${BORDER_COLOR}`, py: { xs: 5, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography
            sx={{
              fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.72rem",
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: SECONDARY_COLOR, mb: 1.5,
            }}
          >
            Partenariats
          </Typography>
          <Typography
            sx={{
              fontFamily: FONT_SERIF, fontWeight: 600,
              fontSize: { xs: "1.8rem", md: "2.5rem" },
              letterSpacing: "-0.025em", color: TEXT_PRIMARY,
              lineHeight: 1.15, mb: 1.5, maxWidth: 560,
            }}
          >
            Ils rendent SunuChat possible
          </Typography>
          <Typography
            sx={{ fontFamily: FONT_SANS, fontSize: "0.9375rem", color: TEXT_SECONDARY, maxWidth: 500, lineHeight: 1.7 }}
          >
            Grâce à leur soutien financier, académique et opérationnel,
            SunuChat est une réalité au service de la santé des communautés sénégalaises.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
        <Stack spacing={3}>
          {partners.map((partner, i) => (
            <PartnerCard key={partner.name} partner={partner} index={i} />
          ))}
        </Stack>

        <Box
          sx={{
            mt: 6,
            p: { xs: 3, md: 4 },
            borderRadius: "16px",
            bgcolor: PRIMARY_COLOR,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: 3,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: FONT_SERIF, fontWeight: 600, fontSize: "1.2rem",
                color: "#fff", mb: 0.5,
              }}
            >
              Vous souhaitez nous rejoindre ?
            </Typography>
            <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.875rem", color: "rgba(255,255,255,0.65)" }}>
              Écrivez-nous pour un partenariat ou un projet pilote.
            </Typography>
          </Box>
          <Link
            href="mailto:contact@sunuchat.sn"
            underline="none"
            sx={{
              display: "inline-flex", alignItems: "center", gap: 1,
              fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.875rem",
              bgcolor: "#fff", color: PRIMARY_COLOR,
              px: 2.5, py: 1.1, borderRadius: "8px",
              whiteSpace: "nowrap", flexShrink: 0,
              "&:hover": { bgcolor: "rgba(255,255,255,0.92)" },
              transition: "background .15s",
            }}
          >
            Nous contacter
            <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
          </Link>
        </Box>
      </Container>
    </Box>
  );
}