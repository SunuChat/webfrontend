// TeamPage.jsx — SunuChat · Editorial Clean
import React from "react";
import {
  Box, Container, Typography, Grid, Stack,
  Avatar, Chip, IconButton, Tooltip,
} from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

import mamouneImg  from "../assets/images/team/mamoune.jpg";
import boubacarImg from "../assets/images/team/boubabcar.jpg";
import bachirImg   from "../assets/images/team/bachir.jpg";
import guisseImg   from "../assets/images/team/guisse.jpg";
import michelImg   from "../assets/images/team/michel.jpg";
import elodieImg   from "../assets/images/team/elodie.jpg";
import salaneImg   from "../assets/images/team/salane.jpg";
import metouImg    from "../assets/images/team/metou.jpg";
import abyImg      from "../assets/images/team/aby.jpg";
import ndeyeFatou  from "../assets/images/team/fatou.jpg";
import fatimImg    from "../assets/images/team/fatima.jpg";
import aminataImg  from "../assets/images/team/amina.webp";
import maremeImg   from "../assets/images/team/mareme.JPG";
import binetouImg  from "../assets/images/team/binetou.jpg";
import ulrichImg   from "../assets/images/team/ulrich.jpg";
import amadouImg   from "../assets/images/team/amadou.jpg";
import pergit      from "../assets/images/team/pergit.png";

import {
  PRIMARY_COLOR, SECONDARY_COLOR,
  BG_PAGE, BG_WHITE, BG_SECTION_ALT,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
  BORDER_COLOR, FONT_SANS, FONT_SERIF,
  SHADOW_CARD, SHADOW_CARD_HOVER,
} from "../constants";

const teamData = [
  {
    section: "Supervision du projet",
    label: "Direction",
    members: [
      { name: "Pr Abdoulaye Guisse",    role: "Chef de projet",            description: "Supervise l'ensemble du projet et oriente les décisions stratégiques.", image: guisseImg,   linkedin: "https://www.linkedin.com/in/abdoulayeguisse/",                                                           email: "aguisse@ept.edu.sn" },
      { name: "Pr Ndeye Fatou Ngom",    role: "Adjointe",                  description: "Appuie la supervision globale du projet.",                              image: ndeyeFatou,  linkedin: "https://www.linkedin.com/in/ndeye-fatou-ngom-83919826/",                                               email: "fngom@ept.edu.sn" },
      { name: "Dr Michel Seck",         role: "Coordonnateur local",        description: "Coordination opérationnelle sur le terrain.",                           image: michelImg,   linkedin: "https://www.linkedin.com/in/michel-seck-80460b63/",                                                     email: "mseck@ept.edu.sn" },
      { name: "Mme Aminata Diallo",     role: "Assistante",                 description: "Assistance administrative et logistique.",                              image: aminataImg,  linkedin: "https://www.linkedin.com/in/mamadou-bachir-sy-891a451b4",                                               email: "aminaba1288@gmail.com" },
      { name: "Dr Amadou Ibra Diallo",  role: "Enseignant-chercheur",       description: "Service de Médecine Préventive et de Santé Publique.",                  image: amadouImg,   linkedin: "https://www.linkedin.com/",                                                                             email: "dialloamadouibra@gmail.com" },
      { name: "Dr Elodie Gauthier",     role: "Partenaire technique",       description: "Collaboratrice chez Orange France.",                                    image: elodieImg,   linkedin: "https://www.linkedin.com/in/elodie-gauthier/",                                                          email: "elodie.gauthier@orange.com" },
      { name: "PER GIT",                role: "Encadrement scientifique",   description: "Pr. Ciss, Pr. Wade, Pr. Gueye, Pr. Niang, Pr. Diouf, Dr. Sidibe.",     image: pergit,      linkedin: "https://www.linkedin.com/in/ecole-polytechnique-thi%C3%A8s-l%E2%80%99officiel-b32426147/",           email: "ept@ept.sn" },
    ],
  },
  {
    section: "Ingénieurs de recherche",
    label: "Core Team",
    members: [
      { name: "Mouhamed El Mamoune Dieye", role: "AI Lead",         description: "Responsable des modèles d'intelligence artificielle.",            image: mamouneImg,  linkedin: "https://www.linkedin.com/in/mouhamed-el-mamoune-dieye/",         email: "mouhamed.e.m.dieye@aims-senegal.org" },
      { name: "Mamadou Bachir SY",         role: "Lead Dev",         description: "Responsable technique et développeur principal de la plateforme.", image: bachirImg,   linkedin: "https://www.linkedin.com/in/mamadou-bachir-sy-891a451b4",        email: "bachirsy26@gmail.com" },
      { name: "Boubacar Diallo",           role: "AI Engineer",      description: "Développement et entraînement des modèles d'IA.",                 image: boubacarImg, linkedin: "https://www.linkedin.com/in/boubacar-diallo-aa9025189/",          email: "dialloboubacar.1999@gmail.com" },
      { name: "Ndeye Awa Salane",          role: "NLP Engineer",     description: "Traitement automatique du langage naturel.",                      image: salaneImg,   linkedin: "https://www.linkedin.com/in/ndeye-awa-salane-a93667230/",         email: "bachirsy26@gmail.com" },
    ],
  },
  {
    section: "Stagiaires",
    label: "Talents",
    members: [
      { name: "Marième Samba",  role: "Stagiaire", description: "Participation aux modules de traitement du langage.", image: maremeImg,  linkedin: "https://www.linkedin.com/in/mareme-yaya-samba-a36309231/",   email: "marieme.samba2018@gmail.com" },
      { name: "Ulrich Nanfack", role: "Stagiaire", description: "Support au développement backend et API.",            image: ulrichImg,  linkedin: "https://www.linkedin.com/in/jeson-nanfack-bab74b2ab/",        email: "ulrichatonfack@gmail.com" },
      { name: "Metou Sanghe",   role: "Stagiaire", description: "Support aux expérimentations IA.",                   image: metouImg,   linkedin: "https://www.linkedin.com/in/m%C3%A9tou-sanghe-655633226/",    email: "metousanghe2000@gmail.com" },
      { name: "Aby Diallo",     role: "Stagiaire", description: "Appui au design d'interfaces et tests utilisateurs.", image: abyImg,     linkedin: "https://www.linkedin.com/in/aby-diallo-31571922a/",           email: "abydiallo456@gmail.com" },
      { name: "Binetou Ba",     role: "Stagiaire", description: "Contribution à la documentation technique.",         image: binetouImg, linkedin: "https://www.linkedin.com/in/binetou-ba-b9a919268/",            email: "bbinetou@ept.edu.sn" },
      { name: "Fatim Dieye",    role: "Stagiaire", description: "Appui à la base de données et aux tests.",           image: fatimImg,   linkedin: "https://www.linkedin.com/in/fatima-dieye-9698852bb/",          email: "dieyef@ept.edu.sn" },
    ],
  },
];

// ── Team card ──────────────────────────────────────────────────────────────
function TeamCard({ member }) {
  return (
    <Box
      sx={{
        bgcolor: BG_WHITE,
        border: `1px solid ${BORDER_COLOR}`,
        borderRadius: "14px",
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        boxShadow: SHADOW_CARD,
        transition: "transform .2s ease, box-shadow .2s ease",
        "&:hover": { transform: "translateY(-4px)", boxShadow: SHADOW_CARD_HOVER },
      }}
    >
      <Avatar
        src={member.image}
        alt={member.name}
        sx={{
          width: 80, height: 80,
          mb: 2, flexShrink: 0,
          border: `3px solid ${BG_SECTION_ALT}`,
          outline: `1px solid ${BORDER_COLOR}`,
          ".MuiAvatar-img": { objectFit: "cover" },
        }}
      />

      <Typography
        sx={{
          fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.9rem",
          color: TEXT_PRIMARY, lineHeight: 1.3, mb: 0.75,
        }}
      >
        {member.name}
      </Typography>

      <Chip
        label={member.role}
        size="small"
        sx={{
          fontFamily: FONT_SANS, fontWeight: 500, fontSize: "0.7rem",
          height: 20, mb: 1.5,
          bgcolor: `${PRIMARY_COLOR}0D`,
          color: PRIMARY_COLOR,
          border: `1px solid ${PRIMARY_COLOR}22`,
        }}
      />

      <Typography
        sx={{
          fontFamily: FONT_SANS, fontSize: "0.82rem", color: TEXT_MUTED,
          lineHeight: 1.65, flex: 1, mb: 2,
        }}
      >
        {member.description}
      </Typography>

      <Stack direction="row" spacing={0.75} mt="auto">
        {member.linkedin && (
          <Tooltip title="LinkedIn">
            <IconButton
              component="a" href={member.linkedin}
              target="_blank" rel="noopener noreferrer"
              size="small"
              sx={{
                width: 30, height: 30, borderRadius: "7px",
                color: TEXT_MUTED, bgcolor: "rgba(0,0,0,0.04)",
                "&:hover": { color: "#0A66C2", bgcolor: "rgba(10,102,194,0.1)" },
                transition: "all .15s",
              }}
            >
              <LinkedInIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        )}
        {member.email && (
          <Tooltip title="Envoyer un email">
            <IconButton
              component="a" href={`mailto:${member.email}`}
              size="small"
              sx={{
                width: 30, height: 30, borderRadius: "7px",
                color: TEXT_MUTED, bgcolor: "rgba(0,0,0,0.04)",
                "&:hover": { color: "#D44638", bgcolor: "rgba(212,70,56,0.1)" },
                transition: "all .15s",
              }}
            >
              <EmailOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Box>
  );
}

// ── Section header ─────────────────────────────────────────────────────────
function SectionHeader({ title, label }) {
  return (
    <Stack direction="row" spacing={2} alignItems="center" mb={3}>
      <Box sx={{ width: 3, height: 22, borderRadius: "3px", bgcolor: PRIMARY_COLOR, flexShrink: 0 }} />
      <Typography
        sx={{
          fontFamily: FONT_SERIF, fontWeight: 600,
          fontSize: { xs: "1.1rem", md: "1.25rem" },
          color: TEXT_PRIMARY, letterSpacing: "-0.01em",
        }}
      >
        {title}
      </Typography>
      <Chip
        label={label}
        size="small"
        sx={{
          fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.7rem", height: 22,
          bgcolor: `${SECONDARY_COLOR}18`, color: "#5a7019",
          border: `1px solid ${SECONDARY_COLOR}44`,
        }}
      />
    </Stack>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function TeamPage() {
  return (
    <Box sx={{ bgcolor: BG_PAGE }}>
      {/* Hero */}
      <Box sx={{ bgcolor: BG_WHITE, borderBottom: `1px solid ${BORDER_COLOR}`, py: { xs: 5, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography
            sx={{
              fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.72rem",
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: SECONDARY_COLOR, mb: 1.5,
            }}
          >
            À propos
          </Typography>
          <Typography
            sx={{
              fontFamily: FONT_SERIF, fontWeight: 600,
              fontSize: { xs: "1.8rem", md: "2.5rem" },
              letterSpacing: "-0.025em", color: TEXT_PRIMARY,
              lineHeight: 1.15, mb: 1.5, maxWidth: 540,
            }}
          >
            L'équipe derrière SunuChat
          </Typography>
          <Typography
            sx={{ fontFamily: FONT_SANS, fontSize: "0.9375rem", color: TEXT_SECONDARY, maxWidth: 520, lineHeight: 1.7 }}
          >
            Une équipe pluridisciplinaire d'enseignants-chercheurs, d'ingénieurs
            et de stagiaires engagés pour l'inclusion numérique en santé.
          </Typography>
        </Container>
      </Box>

      {/* Sections */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
        <Stack spacing={7}>
          {teamData.map((section) => (
            <Box key={section.section}>
              <SectionHeader title={section.section} label={section.label} />
              <Grid container spacing={2.5}>
                {section.members.map((member) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={member.name}>
                    <TeamCard member={member} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}