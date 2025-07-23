// Fichier : TeamPage.jsx
import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  Stack,
  useTheme,
} from "@mui/material";
import { PRIMARY_COLOR, SECONDARY_COLOR } from "../constants";

const teamData = [
  {
    section: "Supervision du projet",
    members: [
      {
        name: "Pr Abdoulaye Guisse",
        role: "Chef de projet",
        description:
          "Supervise l’ensemble du projet et oriente les décisions stratégiques.",
        image: "/images/team/guisse.jpg",
      },
      {
        name: "Pr Ndeye Fatou Ngom",
        role: "Adjointe",
        description: "Appuie la supervision globale du projet.",
        image: "/images/team/ngom.jpg",
      },
      {
        name: "Dr Michel Seck",
        role: "Coordonnateur local",
        description: "Coordination opérationnelle sur le terrain.",
        image: "/images/team/seck.jpg",
      },
      {
        name: "Mme Aminata",
        role: "Assistante",
        description: "Assistance administrative et logistique.",
        image: "/images/team/aminata.jpg",
      },
      {
        name: "PER GIT",
        role: "Encadrement scientifique",
        description:
          "Pr. Ciss, Pr. Wade, Pr. Gueye, Pr. Niang, Pr. Diouf, Dr. Sidibe.",
        image: "/images/team/per.jpg",
      },
      {
        name: "Dr Elodie Gauthier",
        role: "Partenaire technique",
        description: "Collaboratrice chez Orange France.",
        image: "/images/team/gauthier.jpg",
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
        image: "/images/team/mamoune.jpg",
      },
      {
        name: "Mamadou Bachir SY",
        role: "Lead Dev",
        description:
          "Responsable technique et développeur principal de la plateforme.",
        image: "/images/team/bachir.jpg",
      },
      {
        name: "Boubacar Diallo",
        role: "AI Engineer",
        description: "Développement et entraînement des modèles d’IA.",
        image: "/images/team/boubacar.jpg",
      },
      {
        name: "Ndeye Awa SALANE",
        role: "NLP Engineer",
        description: "Traitement automatique du langage naturel.",
        image: "/images/team/awa.jpg",
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
        image: "/images/team/marieme.jpg",
      },
      {
        name: "Ulrich Atonfack",
        role: "Stagiaire",
        description: "Support au développement backend et API.",
        image: "/images/team/ulrich.jpg",
      },
      {
        name: "Metou Sanghe",
        role: "Stagiaire",
        description: "Support aux expérimentations IA.",
        image: "/images/team/metou.jpg",
      },
      {
        name: "Aby Diallo",
        role: "Stagiaire",
        description: "Appui au design d’interfaces et tests utilisateurs.",
        image: "/images/team/aby.jpg",
      },
      {
        name: "Binetou Ba",
        role: "Stagiaire",
        description: "Contribution à la documentation technique.",
        image: "/images/team/binetou.jpg",
      },
      {
        name: "Fatim Dieye",
        role: "Stagiaire",
        description: "Appui à la base de données et aux tests.",
        image: "/images/team/fatim.jpg",
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
        alt={member.name}
        sx={{ width: 90, height: 90, mx: "auto", mb: 2 }}
      />
      <Typography variant="h6" fontWeight="bold">
        {member.name}
      </Typography>
      <Typography variant="subtitle2" color={SECONDARY_COLOR} gutterBottom>
        {member.role}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {member.description}
      </Typography>
    </Card>
  );
}

export default function TeamPage() {
  const theme = useTheme();

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
