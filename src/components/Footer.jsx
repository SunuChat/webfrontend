import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  Stack,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";
import EmailIcon from "@mui/icons-material/Email";
import ChatIcon from "@mui/icons-material/Chat";
import PhoneIcon from "@mui/icons-material/Phone";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import {
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_MUTED,
  FOOTER_BG,
} from "../constants";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        position: "relative",
        bgcolor: FOOTER_BG,
        color: TEXT_PRIMARY,
        pt: { xs: 6, md: 8 },
      }}
    >
      {/* Top accent gradient */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`,
        }}
      />

      <Container>
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            mb: { xs: 5, md: 6 },
            background: `linear-gradient(120deg, ${PRIMARY_COLOR}1A, ${SECONDARY_COLOR}1A)`,
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", md: "center" }}
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={1.25} alignItems="center">
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    display: "grid",
                    placeItems: "center",
                    background: `linear-gradient(135deg, ${SECONDARY_COLOR}, ${PRIMARY_COLOR})`,
                  }}
                >
                  <Typography color="#fff" fontWeight={900}>
                    S
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={900}>
                    Restez informé
                  </Typography>
                  <Typography variant="body2" color={TEXT_SECONDARY}>
                    Nouveautés, santé, accessibilité — 1 email / mois.
                  </Typography>
                </Box>
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                width={{ xs: "100%", md: "auto" }}
              >
                <TextField
                  size="small"
                  placeholder="Votre email"
                  type="email"
                  sx={{
                    minWidth: { xs: "100%", sm: 280 },
                    bgcolor: "#fff",
                    borderRadius: 2,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: TEXT_MUTED }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  endIcon={<SendRoundedIcon />}
                  sx={{
                    borderRadius: 2,
                    bgcolor: PRIMARY_COLOR,
                    "&:hover": { bgcolor: SECONDARY_COLOR },
                  }}
                >
                  S'abonner
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={6}>
          <Grid item xs={12} md={6} lg={3}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 2,
                  background: `linear-gradient(to right, ${SECONDARY_COLOR}, ${PRIMARY_COLOR})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography color="#fff" fontWeight="bold" fontSize={18}>
                  S
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight="bold">
                SunuChat
              </Typography>
              <Chip
                size="small"
                label="beta"
                sx={{
                  ml: 0.5,
                  bgcolor: `${SECONDARY_COLOR}22`,
                  color: SECONDARY_COLOR,
                  border: `1px solid ${SECONDARY_COLOR}55`,
                }}
              />
            </Stack>
            <Typography
              variant="body2"
              color={TEXT_SECONDARY}
              mb={2}
              sx={{ maxWidth: 420 }}
            >
              Offrir aux communautés sénégalaises un accès simplifié à des
              informations de santé grâce à l'intelligence artificielle.
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <RoomIcon sx={{ fontSize: 16, color: TEXT_MUTED }} />
              <Typography variant="caption" color={TEXT_MUTED}>
                Sénégal
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              {[
                {
                  icon: <LinkedInIcon fontSize="small" />,
                  href: "https://www.linkedin.com/",
                },
                {
                  icon: <TwitterIcon fontSize="small" />,
                  href: "https://x.com/",
                },
                {
                  icon: <InstagramIcon fontSize="small" />,
                  href: "https://instagram.com/",
                },
                {
                  icon: <FacebookIcon fontSize="small" />,
                  href: "https://facebook.com/",
                },
              ].map((s, i) => (
                <IconButton
                  key={i}
                  component="a"
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={{
                    color: PRIMARY_COLOR,
                    border: `1px solid ${PRIMARY_COLOR}33`,
                  }}
                >
                  {s.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Plateforme
            </Typography>
            <NavLinks
              links={[
                { label: "Chatbot IA", href: "/chatbot" },
                { label: "Tableau de bord santé", href: "/dashboard" },
                { label: "Comment ça marche", href: "/#features" },
                { label: "Commencer", href: "/#hero_section" },
              ]}
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              L'entreprise
            </Typography>
            <NavLinks
              links={[
                { label: "Notre équipe", href: "/team" },
                { label: "Partenaires", href: "/partners" },
                { label: "Politique de confidentialité", href: "/privacy" },
                { label: "Conditions d'utilisation", href: "/terms" },
                { label: "Accessibilité", href: "/accessibility" },
              ]}
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Contact
            </Typography>
            <Stack spacing={2}>
              <ItemRow
                icon={<EmailIcon sx={{ fontSize: 16, color: TEXT_MUTED }} />}
              >
                <Link
                  underline="hover"
                  color={TEXT_SECONDARY}
                  href={"mailto:hello@sunuchat.org"}
                  sx={{ "&:hover": { color: SECONDARY_COLOR } }}
                >
                  hello@sunuchat.org
                </Link>
              </ItemRow>
              <ItemRow
                icon={<ChatIcon sx={{ fontSize: 16, color: TEXT_MUTED }} />}
              >
                Assistance 24/7
              </ItemRow>
              <ItemRow
                icon={<PhoneIcon sx={{ fontSize: 16, color: TEXT_MUTED }} />}
              >
                <Link
                  underline="hover"
                  color={TEXT_SECONDARY}
                  href={"tel:+221777344030"}
                  sx={{ "&:hover": { color: SECONDARY_COLOR } }}
                >
                  +221 77 734 40 30
                </Link>
              </ItemRow>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6, borderColor: "#ddd" }} />

        {/* Sponsors / Supported by */}
        <Box textAlign="center" mb={4}>
          <Typography variant="body2" color={TEXT_MUTED} gutterBottom>
            Soutenu par
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            flexWrap="wrap"
            color={TEXT_SECONDARY}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" fontWeight="medium">
                Grand Challenges Canada
              </Typography>
              <LanguageRoundedIcon sx={{ fontSize: 16, color: TEXT_MUTED }} />
            </Stack>
          </Stack>
        </Box>

        <Divider sx={{ borderColor: "#ddd" }} />

        <Box
          mt={4}
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          <Typography variant="caption" color={PRIMARY_COLOR}>
            © {new Date().getFullYear()} SunuChat. Tous droits réservés.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Link href="/privacy" underline="hover" color={TEXT_MUTED}>
              Confidentialité
            </Link>
            <Link href="/terms" underline="hover" color={TEXT_MUTED}>
              Conditions
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

function NavLinks({ links }) {
  return (
    <Stack spacing={1}>
      {links.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          underline="hover"
          color={TEXT_SECONDARY}
          sx={{
            "&:hover": { color: SECONDARY_COLOR },
            transition: "color 0.3s",
          }}
        >
          {item.label}
        </Link>
      ))}
    </Stack>
  );
}

function ItemRow({ icon, children }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {icon}
      <Typography variant="body2" color={TEXT_SECONDARY}>
        {children}
      </Typography>
    </Stack>
  );
}
