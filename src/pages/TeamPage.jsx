// Fichier : TeamPage.jsx (refonte visuelle premium)
import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Avatar,
  Stack,
  Chip,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import { PRIMARY_COLOR, SECONDARY_COLOR } from "../constants";

// Images (inchangées)
import mamouneImg from "../assets/images/team/mamoune.jpg";
import boubacarImg from "../assets/images/team/boubabcar.jpg";
import bachirImg from "../assets/images/team/bachir.jpg";
import guisseImg from "../assets/images/team/guisse.jpg";
import michelImg from "../assets/images/team/michel.jpg";
import elodieImg from "../assets/images/team/elodie.jpg";
import salaneImg from "../assets/images/team/salane.jpg";
import metouImg from "../assets/images/team/metou.jpg";
import abyImg from "../assets/images/team/aby.jpg";
import ndeyeFatou from "../assets/images/team/fatou.jpg";
import fatimImg from "../assets/images/team/fatima.jpg";
import aminataImg from "../assets/images/team/amina.webp";
import maremeImg from "../assets/images/team/mareme.JPG";
import binetouImg from "../assets/images/team/binetou.jpg";
import ulrichImg from "../assets/images/team/ulrich.jpg";

const teamData = [
  {
    section: "Supervision du projet",
    badge: "Direction",
    icon: <VerifiedRoundedIcon fontSize="small" />,
    members: [
      {
        name: "Pr Abdoulaye Guisse",
        role: "Chef de projet",
        description:
          "Supervise l’ensemble du projet et oriente les décisions stratégiques.",
        image: guisseImg,
        linkedin: "https://www.linkedin.com/in/abdoulayeguisse/",
        email: "aguisse@ept.edu.sn",
      },
      {
        name: "Pr Ndeye Fatou Ngom",
        role: "Adjointe",
        description: "Appuie la supervision globale du projet.",
        image: ndeyeFatou,
        linkedin: "https://www.linkedin.com/in/ndeye-fatou-ngom-83919826/",
        email: "fngom@ept.edu.sn",
      },
      {
        name: "Dr Michel Seck",
        role: "Coordonnateur local",
        description: "Coordination opérationnelle sur le terrain.",
        image: michelImg,
        linkedin: "https://www.linkedin.com/in/michel-seck-80460b63/",
        email: "mseck@ept.edu.sn",
      },
      {
        name: "Mme Aminata Diallo",
        role: "Assistante",
        description: "Assistance administrative et logistique.",
        image: aminataImg,
        linkedin: "https://www.linkedin.com/in/mamadou-bachir-sy-891a451b4",
        email: "aminaba1288@gmail.com",
      },
      {
        name: "PER GIT",
        role: "Encadrement scientifique",
        description:
          "Pr. Ciss, Pr. Wade, Pr. Gueye, Pr. Niang, Pr. Diouf, Dr. Sidibe.",
        image: "/images/team/per.jpg",
        linkedin:
          "https://www.linkedin.com/in/ecole-polytechnique-thi%C3%A8s-l%E2%80%99officiel-b32426147/",
        email: "ept@ept.sn",
      },
      {
        name: "Dr Elodie Gauthier",
        role: "Partenaire technique",
        description: "Collaboratrice chez Orange France.",
        image: elodieImg,
        linkedin: "https://www.linkedin.com/in/elodie-gauthier/",
        email: "elodie.gauthier@orange.com",
      },
    ],
  },
  {
    section: "Ingénieurs de recherche",
    badge: "Core Team",
    icon: <StarRateRoundedIcon fontSize="small" />,
    members: [
      {
        name: "Mouhamed El Mamoune DIEYE",
        role: "AI Lead",
        description: "Responsable des modèles d’intelligence artificielle.",
        image: mamouneImg,
        linkedin: "https://www.linkedin.com/in/mouhamed-el-mamoune-dieye/",
        email: "mouhamed.e.m.dieye@aims-senegal.org",
      },
      {
        name: "Mamadou Bachir SY",
        role: "Lead Dev",
        description:
          "Responsable technique et développeur principal de la plateforme.",
        image: bachirImg,
        linkedin: "https://www.linkedin.com/in/mamadou-bachir-sy-891a451b4",
        email: "bachirsy26@gmail.com",
      },
      {
        name: "Boubacar Diallo",
        role: "AI Engineer",
        description: "Développement et entraînement des modèles d’IA.",
        image: boubacarImg,
        linkedin: "https://www.linkedin.com/in/boubacar-diallo-aa9025189/",
        email: "dialloboubacar.1999@gmail.com",
      },
      {
        name: "Ndeye Awa SALANE",
        role: "NLP Engineer",
        description: "Traitement automatique du langage naturel.",
        image: salaneImg,
        linkedin: "https://www.linkedin.com/in/ndeye-awa-salane-a93667230/",
        email: "bachirsy26@gmail.com",
      },
    ],
  },
  {
    section: "Stagiaires",
    badge: "Talents",
    icon: <Groups2RoundedIcon fontSize="small" />,
    members: [
      {
        name: "Marième Samba",
        role: "Stagiaire",
        description: "Participation aux modules de traitement du langage.",
        image: maremeImg,
        linkedin: "https://www.linkedin.com/in/mareme-yaya-samba-a36309231/",
        email: "marieme.samba2018@gmail.com",
      },
      {
        name: "Ulrich Nanfack",
        role: "Stagiaire",
        description: "Support au développement backend et API.",
        image: ulrichImg,
        linkedin: "https://www.linkedin.com/in/jeson-nanfack-bab74b2ab/",
        email: "ulrichatonfack@gmail.com",
      },
      {
        name: "Metou Sanghe",
        role: "Stagiaire",
        description: "Support aux expérimentations IA.",
        image: metouImg,
        linkedin: "https://www.linkedin.com/in/m%C3%A9tou-sanghe-655633226/",
        email: "metousanghe2000@gmail.com",
      },
      {
        name: "Aby Diallo",
        role: "Stagiaire",
        description: "Appui au design d’interfaces et tests utilisateurs.",
        image: abyImg,
        linkedin: "https://www.linkedin.com/in/aby-diallo-31571922a/",
        email: "abydiallo456@gmail.com",
      },
      {
        name: "Binetou Ba",
        role: "Stagiaire",
        description: "Contribution à la documentation technique.",
        image: binetouImg,
        linkedin: "https://www.linkedin.com/in/binetou-ba-b9a919268/",
        email: "bbinetou@ept.edu.sn",
      },
      {
        name: "Fatim Dieye",
        role: "Stagiaire",
        description: "Appui à la base de données et aux tests.",
        image: fatimImg,
        linkedin: "https://www.linkedin.com/in/fatima-dieye-9698852bb/",
        email: "dieyef@ept.edu.sn",
      },
    ],
  },
];

function TeamCard({ member }) {
  return (
    <Card
      elevation={0}
      sx={{
        textAlign: "center",
        borderRadius: 4,
        p: 3,
        height: "100%",
        background: "linear-gradient(180deg, #fff, #ffffffcc)",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        transition: "transform .25s ease, box-shadow .25s ease",
        ":hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 20px 48px rgba(0,0,0,0.12)",
        },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ position: "relative", mb: 2 }}>
        <Avatar
          src={member.image}
          alt={member.name}
          sx={{
            width: 96,
            height: 96,
            mx: "auto",
            boxShadow: `0 8px 24px ${PRIMARY_COLOR}33`,
            border: `3px solid ${PRIMARY_COLOR}20`,
            ".MuiAvatar-img": { objectFit: "cover" },
          }}
        />
        {/* Anneau coloré */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            m: "auto",
            width: 112,
            height: 112,
            borderRadius: "50%",
            border: `2px dashed ${SECONDARY_COLOR}55`,
            pointerEvents: "none",
          }}
        />
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 800 }}>
        {member.name}
      </Typography>
      <Chip
        label={member.role}
        size="small"
        sx={{
          mt: 0.75,
          alignSelf: "center",
          bgcolor: `${SECONDARY_COLOR}22`,
          color: SECONDARY_COLOR,
          border: `1px solid ${SECONDARY_COLOR}55`,
          fontWeight: 600,
        }}
      />

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 1.5, mb: 2 }}
      >
        {member.description}
      </Typography>

      <Stack direction="row" justifyContent="center" spacing={1.5} mt="auto">
        {member.linkedin && (
          <Tooltip title="LinkedIn">
            <IconButton
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{
                color: "#0A66C2",
                border: "1px solid rgba(10,102,194,0.25)",
              }}
            >
              <LinkedInIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {member.email && (
          <Tooltip title="Envoyer un email">
            <IconButton
              href={`mailto:${member.email}`}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{
                color: "#D44638",
                border: "1px solid rgba(212,70,56,0.25)",
              }}
            >
              <EmailIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Card>
  );
}

function SectionHeader({ title, badge, icon }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
      <Box
        sx={{ width: 6, height: 28, borderRadius: 3, bgcolor: SECONDARY_COLOR }}
      />
      <Typography
        variant="h5"
        sx={{ fontWeight: 900, color: PRIMARY_COLOR, letterSpacing: "-0.01em" }}
      >
        {title}
      </Typography>
      {badge && (
        <Chip
          icon={icon}
          label={badge}
          size="small"
          sx={{
            ml: 1,
            bgcolor: `${PRIMARY_COLOR}14`,
            color: PRIMARY_COLOR,
            border: `1px solid ${PRIMARY_COLOR}40`,
            fontWeight: 600,
          }}
        />
      )}
    </Stack>
  );
}

export default function TeamPage() {
  return (
    <Box sx={{ backgroundColor: "#f5f7fb" }}>
      {/* Hero bandeau */}
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
            À propos
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              letterSpacing: "-0.02em",
              textShadow: "0 8px 24px rgba(0,0,0,0.2)",
            }}
          >
            L'équipe SunuChat
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ maxWidth: 820, mt: 1.5, opacity: 0.95 }}
          >
            Une équipe pluridisciplinaire engagée pour l'inclusion et l'accès à
            l'information médicale.
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Chip
              icon={<Groups2RoundedIcon />}
              label="Multidisciplinaire"
              sx={heroChip}
            />
            <Chip
              icon={<StarRateRoundedIcon />}
              label="Impact social"
              sx={heroChip}
            />
            <Chip
              icon={<VerifiedRoundedIcon />}
              label="Qualité & éthique"
              sx={heroChip}
            />
          </Stack>
        </Container>
      </Box>

      {/* Corps */}
      <Container sx={{ py: { xs: 6, md: 10 } }}>
        {teamData.map((section, idx) => (
          <Box key={idx} sx={{ mb: { xs: 8, md: 10 } }}>
            <SectionHeader
              title={section.section}
              badge={section.badge}
              icon={section.icon}
            />
            <Grid container spacing={3.5}>
              {section.members.map((member, i) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                  <TeamCard member={member} />
                </Grid>
              ))}
            </Grid>
            {idx < teamData.length - 1 && (
              <Divider sx={{ mt: { xs: 6, md: 8 } }} />
            )}
          </Box>
        ))}
      </Container>
    </Box>
  );
}

const heroChip = {
  bgcolor: "rgba(255,255,255,0.16)",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.35)",
  backdropFilter: "blur(6px)",
};
