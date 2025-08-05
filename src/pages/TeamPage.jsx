// Fichier : TeamPage.jsx
import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Avatar,
  Stack,
} from "@mui/material";
import { PRIMARY_COLOR, SECONDARY_COLOR } from "../constants";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
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
        name: "Ulrich Atonfack",
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
      elevation={3}
      sx={{
        textAlign: "center",
        borderRadius: 3,
        p: 3,
        height: "100%",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Avatar
        src={member.image}
        sx={{
          width: 90,
          height: 90,
          mx: "auto",
          mb: 2,
          "& img": {
            objectFit: "contain",
          },
        }}
      />

      <Typography variant="h6" fontWeight="bold">
        {member.name}
      </Typography>
      <Typography variant="subtitle2" color={SECONDARY_COLOR} gutterBottom>
        {member.role}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        {member.description}
      </Typography>

      <Stack direction="row" justifyContent="center" spacing={2} mt="auto">
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#0A66C2" }}
          >
            <LinkedInIcon />
          </a>
        )}
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#D44638",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <EmailIcon />
          </a>
        )}
      </Stack>
    </Card>
  );
}

export default function TeamPage() {
  return (
    <Box sx={{ backgroundColor: "#f0f4f8", py: 10 }}>
      <Container>
        <Typography
          variant="h3"
          fontWeight="bold"
          align="center"
          gutterBottom
          color={PRIMARY_COLOR}
        >
          L'équipe SunuChat
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          maxWidth="sm"
          mx="auto"
          mb={8}
        >
          Une équipe pluridisciplinaire engagée pour l'inclusion et l'accès à
          l'information médicale.
        </Typography>

        {teamData.map((section, idx) => (
          <Box key={idx} mb={10}>
            <Typography
              variant="h5"
              fontWeight="bold"
              color={PRIMARY_COLOR}
              mb={3}
              sx={{
                borderLeft: `5px solid ${SECONDARY_COLOR}`,
                pl: 2,
              }}
            >
              {section.section}
            </Typography>
            <Grid container spacing={4}>
              {section.members.map((member, i) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                  <TeamCard member={member} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Container>
    </Box>
  );
}
